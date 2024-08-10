from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrIsSelf(BasePermission):
    """
    Custom permission to allow admins to access any profile and users to access their own profiles.
    """

    def has_object_permission(self, request, view, obj):
        # Admins can view, update, and delete any profile
        if request.user.is_staff:
            return True

        # Users can view and update their own profile
        if request.method in SAFE_METHODS or request.method == 'PUT':
            return obj.profile.user == request.user

        # No delete permission for non-admin users
        return False
