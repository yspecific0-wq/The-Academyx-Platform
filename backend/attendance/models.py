# backend/attendance/models.py
from django.db import models
from django.contrib.auth.models import User
from accounts.models import UserProfile # Import your profile model

class Attendance(models.Model):
    STATUS_CHOICES = (
        ('PRESENT', 'Present'), ('ABSENT', 'Absent'),
        ('LATE', 'Late'), ('LEAVE', 'On Leave'),
    )
    # Changed from User to UserProfile to match your dashboard logic
    student = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='attendances')
    marked_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='marked_attendances')
    date = models.DateField() 
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    teacher = models.ForeignKey(User, on_delete=models.CASCADE) 
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('student', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.student.user.username} - {self.date} - {self.status}"