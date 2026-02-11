from rest_framework import serializers
from .models import Attendance
from accounts.models import UserProfile, ClassRoom 

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.get_full_name')

    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_name', 'date', 'status', 'remarks']