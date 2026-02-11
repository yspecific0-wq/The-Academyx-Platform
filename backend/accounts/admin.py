from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'school')
    list_filter = ('role', 'school')
    search_fields = ('user__username',)
