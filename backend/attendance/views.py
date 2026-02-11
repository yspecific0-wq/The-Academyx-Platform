# backend/attendance/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.db import transaction 
from .models import Attendance
from .serializers import AttendanceSerializer
from accounts.models import UserProfile 

# 1. Teacher View: Submit and Check Daily Attendance
class SubmitAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Returns existing attendance for a specific date to populate the UI."""
        date = request.query_params.get('date')
        if not date: 
            return Response({"error": "Date required"}, status=status.HTTP_400_BAD_REQUEST)
        
        records = Attendance.objects.filter(date=date)
        # We return the student profile ID as the key so the frontend can map it to its student list.
        return Response({r.student.userprofile.id: r.status for r in records if hasattr(r.student, 'userprofile')})

 # backend/attendance/views.py

def post(self, request):
        """Saves or updates attendance records using the username as the identifier."""
        date = request.data.get('date')
        # React is sending 'attendance' or 'records' as a dictionary
        # We check both to be safe based on your previous logs
        attendance_map = request.data.get('attendance') or request.data.get('records', {}) 

        if not date or not attendance_map:
            return Response({"error": "Missing data (date or attendance)"}, status=400)

        try:
            with transaction.atomic():
                for identifier, status_val in attendance_map.items():
                    # 1. Look up the profile by username (e.g., "b_brown")
                    profile = UserProfile.objects.get(user__username=identifier)
                    
                    # 2. Get the actual User instance for the Attendance model
                    user_instance = profile.user 
                    
                    # 3. Update or create the record
                    Attendance.objects.update_or_create(
                        student=user_instance, 
                        date=date,
                        defaults={
                            'status': status_val,
                            'marked_by': request.user,
                            'teacher': request.user
                        }
                    )
            return Response({"message": "Attendance saved successfully!"}, status=200)
        except UserProfile.DoesNotExist:
            return Response({"error": f"Student '{identifier}' not found."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
# 2. Parent/Admin View: Get Full History for a Specific Student
class AttendanceReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({"error": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        # We filter by student__userprofile__id to allow parents to query using the profile ID
        records = Attendance.objects.filter(student__userprofile__id=student_id).order_by('-date')
        serializer = AttendanceSerializer(records, many=True)
        return Response(serializer.data)

# 3. Student View: Get Personal Stats for Dashboard
class StudentAttendanceStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetches records for the currently logged-in student user
        queryset = Attendance.objects.filter(student=request.user)
        
        # Aggregates totals for the pie chart
        stats = queryset.values('status').annotate(total=Count('status'))
        summary = {item['status']: item['total'] for item in stats}
        
        # Pulls the 5 most recent records for the dashboard activity feed
        recent = queryset.order_by('-date')[:5].values('date', 'status')
        
        return Response({
            "summary": summary,
            "recent": list(recent),
            "total_days": queryset.count()
        })