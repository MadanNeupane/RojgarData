from rest_framework.permissions import BasePermission

class IsAdminOrCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.profile.admin_companies.filter(id=view.kwargs['company_id']).exists()

    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.posted_by == request.user.profile

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'employee'
