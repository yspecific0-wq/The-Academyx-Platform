# backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, ClassRoom

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ClassRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ['id', 'name', 'room_number']

# --- NEW SERIALIZER FOR PARENT DASHBOARD ---
# backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class ParentDashboardSerializer(serializers.ModelSerializer):
    # This pulls the 'username' from the User model linked to the profile
    student_name = serializers.CharField(source='user.username', read_only=True)
    # This pulls the school name
    school_name = serializers.CharField(source='school.name', default="Mother Teresa", read_only=True)
    # This gets the human-readable class name (e.g., "Grade 10")
    class_display = serializers.CharField(source='get_assigned_class_display', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'student_name', 'class_display', 'school_name']    
class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = (
            'id', 'user', 'role', 'school',
            'subject', 'assigned_class',
            'parent_link', 'pending_parent_email'
        )
        depth = 1