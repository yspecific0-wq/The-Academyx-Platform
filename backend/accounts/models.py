from django.db import models
from django.contrib.auth.models import User

class ClassRoom(models.Model):
    name = models.CharField(max_length=50, unique=True)  # e.g., "Grade 10-A"
    
    # "In-charge" logic: One teacher can be the head of this specific class
    class_teacher = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'userprofile__role': 'TEACHER'},
        related_name="managed_class"
    )
    room_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ("SCHOOL_ADMIN", "School Admin"),
        ("TEACHER", "Teacher"),
        ("STUDENT", "Student"),
        ("PARENT", "Parent"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    school = models.ForeignKey(
        "schools.School",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # --- TEACHER SPECIFIC ---
    subject = models.CharField(max_length=100, blank=True, null=True)
    
    # "Multiple Classes" logic: Allows teacher to be assigned to many classes
    assigned_classes = models.ManyToManyField(
        ClassRoom, 
        blank=True, 
        related_name="teachers_assigned"
    )
    
    # --- STUDENT SPECIFIC ---
    assigned_class = models.ForeignKey(
        ClassRoom, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name="students"
    )
    
    # --- PARENT LINKING ---
    parent_link = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='children',
        limit_choices_to={'role': 'PARENT'}
    )
    pending_parent_email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"