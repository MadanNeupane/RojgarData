from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import EmployeeProfile

class ProfileVisibilityPermission(BasePermission):
    """
    Custom permission to allow access based on profile visibility.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can access any profile
        if request.user.is_staff:
            return True

        # Users can view and update their own profile
        if request.method in SAFE_METHODS or request.method == 'PUT':
            return obj.profile.user == request.user

        # Handle profile visibility
        if request.method == 'GET':
            if obj.profile_visibility == EmployeeProfile.PUBLIC:
                return True
            elif obj.profile_visibility == EmployeeProfile.AUTHENTICATED:
                return request.user.is_authenticated
            elif obj.profile_visibility == EmployeeProfile.EMPLOYER:
                # Check if the user is an employer based on their role
                return request.user.role == 'employer'

        # No delete permission for non-admin users
        return False
