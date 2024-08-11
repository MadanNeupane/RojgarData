from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAuthorOrAdmin(BasePermission):
    """
    Custom permission to only allow authors of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the post or admin.
        return obj.author == request.user or request.user.is_staff

class IsAuthenticatedOrCanSubmit(BasePermission):
    """
    Custom permission to allow submission of guest articles by both authenticated and non-authenticated users.
    """
    def has_permission(self, request, view):
        # Allow anyone to create a guest article submission.
        return request.method in SAFE_METHODS or request.method == 'POST'

    def has_object_permission(self, request, view, obj):
        # Allow GET for all, but only authors can update their submission or admins
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff
