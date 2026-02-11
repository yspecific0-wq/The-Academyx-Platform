from rest_framework.permissions import BasePermission

class IsSchoolAdmin(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        profile = getattr(request.user, "userprofile", None)
        if not profile:
            return False

        return profile.role == "SCHOOL_ADMIN"
