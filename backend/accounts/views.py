import csv
import io
from django.db import transaction
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import UserProfile, ClassRoom
# Import specialized serializers
from .serializers import UserProfileSerializer, ParentDashboardSerializer

# --- AUTHENTICATION & TOKEN VIEWS ---

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        try:
            profile = UserProfile.objects.get(user=self.user)
            data['role'] = profile.role 
            data['user'] = {'id': self.user.id, 'username': self.user.username}
        except UserProfile.DoesNotExist:
            data['role'] = None
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# --- PROFILE & DASHBOARDS ---
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        return Response(UserProfileSerializer(profile).data)

class HomeView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({"message": "Welcome to the API"})


class AdminDashboardView(APIView):
    """
    Returns statistics for the dashboard.
    """
    permission_classes = [IsAuthenticated]
    def get(self, request):
        data = {
            "total_teachers": UserProfile.objects.filter(role='TEACHER').count(),
            "total_students": UserProfile.objects.filter(role='STUDENT').count(),
            "total_parents": UserProfile.objects.filter(role='PARENT').count(),
            "total_users": User.objects.count(),
            "total_classes": ClassRoom.objects.count(), 
        }
        return Response(data)

# NEW: Teacher Dashboard Logic
class TeacherDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            profile = request.user.userprofile
            # Logic: Teacher In-charge of these specific classes
            managed = ClassRoom.objects.filter(class_teacher=request.user)
            # Logic: Teacher assigned to teach these classes (ManyToMany)
            assigned = profile.assigned_classes.all()
            
            # Count unique students in all those classes
            total_students = UserProfile.objects.filter(
                role='STUDENT', 
                assigned_class__in=assigned
            ).distinct().count()

            return Response({
                "assigned_classes_count": assigned.count(),
                "managed_classes": [c.name for c in managed],
                "total_students": total_students,
                "attendance_reports_today": 0 
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class TeacherStudentListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile = request.user.userprofile
        students = UserProfile.objects.filter(
            role='STUDENT', 
            assigned_class__in=profile.assigned_classes.all()
        )
        return Response(UserProfileSerializer(students, many=True).data)
    
class ParentDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            parent_profile = request.user.userprofile 
            children = UserProfile.objects.filter(parent_link=parent_profile, role='STUDENT') 
            serializer = ParentDashboardSerializer(children, many=True) 
            return Response(serializer.data) 
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
# --- USER MANAGEMENT & DELETION ---

class AdminDeleteUserView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            if user.is_superuser:
                return Response({"error": "Cannot delete superuser"}, status=status.HTTP_400_BAD_REQUEST)
            user.delete() 
            return Response({"message": "User deleted successfully"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminBulkDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        role = request.data.get('role')
        if role not in ['STUDENT', 'TEACHER', 'PARENT']:
            return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            deleted_count, _ = User.objects.filter(userprofile__role=role, is_superuser=False).delete()
        return Response({"message": f"Successfully deleted {deleted_count} {role.lower()}s."})

# --- TEACHER MANAGEMENT ---

class AdminTeacherListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        teachers = UserProfile.objects.filter(role='TEACHER')
        return Response(UserProfileSerializer(teachers, many=True).data)

class AdminCreateTeacherView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        data = request.data
        try:
            user = User.objects.create_user(username=data['username'], password=data['password'])
            UserProfile.objects.create(user=user, role='TEACHER', subject=data.get('subject', 'N/A'))
            return Response({"message": "Teacher created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- STUDENT & PARENT MANAGEMENT ---

class AdminStudentListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        students = UserProfile.objects.filter(role='STUDENT')
        return Response(UserProfileSerializer(students, many=True).data)

class ParentListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        parents = UserProfile.objects.filter(role='PARENT')
        return Response(UserProfileSerializer(parents, many=True).data)

class AdminLinkStudentParentView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            student = UserProfile.objects.get(id=request.data.get('student_id'), role='STUDENT')
            parent = UserProfile.objects.get(id=request.data.get('parent_id'), role='PARENT')
            student.parent_link = parent
            student.save()
            return Response({"message": "Linked successfully"})
        except UserProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

class AdminSyncLinksView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        students = UserProfile.objects.filter(role='STUDENT', parent_link__isnull=True)
        synced_count = 0
        for student in students:
            if student.pending_parent_email:
                parent_user = User.objects.filter(email=student.pending_parent_email).first()
                if parent_user and hasattr(parent_user, 'userprofile'):
                    student.parent_link = parent_user.userprofile
                    student.save()
                    synced_count += 1
        return Response({"message": f"Successfully synced {synced_count} links."})

# --- CLASS MANAGEMENT ---

class AdminClassListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        classes = ClassRoom.objects.all()
        serializer_data = []
        for c in classes:
            teacher_name = c.class_teacher.get_full_name() or c.class_teacher.username if c.class_teacher else "Unassigned"
            serializer_data.append({
                "id": c.id, "name": c.name, "teacher": teacher_name, "student_count": c.students.count() 
            })
        return Response(serializer_data)

class AdminCreateClassView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        name = request.data.get('name')
        teacher_id = request.data.get('teacher_id')
        teacher = User.objects.filter(id=teacher_id).first()
        ClassRoom.objects.get_or_create(name=name, defaults={'class_teacher': teacher})
        return Response({"message": "Class created successfully"}, status=status.HTTP_201_CREATED)

class AdminAssignStudentToClassView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            student = UserProfile.objects.get(id=request.data.get('student_id'), role='STUDENT')
            classroom = ClassRoom.objects.get(id=request.data.get('class_id'))
            student.assigned_class = classroom
            student.save()
            return Response({"message": f"Assigned to {classroom.name}"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        

# --- BULK UPLOAD VIEWS ---

class BulkStudentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        file = request.FILES.get('file')
        if not file: return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        decoded_file = file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded_file))
        count = 0
        for row in reader:
            username = row.get('username')
            if not username: continue
            user, created = User.objects.get_or_create(username=username, defaults={'email': row.get('email', '')})
            if created:
                user.set_password('Student123!')
                user.save()
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.role = 'STUDENT'
            class_name = row.get('class_name')
            if class_name:
                classroom, _ = ClassRoom.objects.get_or_create(name=class_name)
                profile.assigned_class = classroom
            profile.save()
            count += 1
        return Response({"message": f"Processed {count} students."})

class BulkParentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        file = request.FILES.get('file')
        if not file: return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        decoded_file = file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded_file))
        count = 0
        for row in reader:
            username = row.get('username')
            if not username: continue
            user, created = User.objects.get_or_create(username=username, defaults={'email': row.get('email', '')})
            if created:
                user.set_password('Parent123!')
                user.save()
            parent_profile, _ = UserProfile.objects.get_or_create(user=user)
            parent_profile.role = 'PARENT'
            parent_profile.save()
            UserProfile.objects.filter(role='STUDENT', pending_parent_email=row.get('email')).update(parent_link=parent_profile)
            count += 1
        return Response({"message": f"Processed {count} parents."})

class BulkTeacherUploadView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        file = request.FILES.get('file')
        if not file: return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        decoded_file = file.read().decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded_file))
        count = 0
        for row in reader:
            username = row.get('username')
            if not username: continue
            user, created = User.objects.get_or_create(username=username, defaults={'email': row.get('email', '')})
            if created:
                user.set_password('Teacher123!')
                user.save()
            profile, _ = UserProfile.objects.get_or_create(user=user)
            profile.role = 'TEACHER'
            profile.subject = row.get('subject', 'N/A')
            profile.save()
            count += 1
        return Response({"message": f"Processed {count} teachers."})