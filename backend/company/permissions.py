from rest_framework.permissions import BasePermission
from accounts.models import Profile

class IsCompanyAdminOrReadOnly(BasePermission):
    """
    Custom permission to allow only company admins to edit the company details.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        # Write permissions are only allowed to company admins
        return request.user.is_staff or request.user.profile in obj.admins.all()


class CanAskQuestionsOrReview(BasePermission):
    """
    Custom permission to allow only employees to ask questions and write reviews.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employee'


class CanSubmitSuggestions(BasePermission):
    """
    Custom permission to allow authenticated users to submit company update suggestions.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated


class CanReportSpam(BasePermission):
    """
    Custom permission to allow authenticated users to report spam on reviews.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated
