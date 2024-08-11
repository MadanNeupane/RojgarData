from rest_framework.permissions import BasePermission

class IsAdminOrCompanyAdmin(BasePermission):
    def has_permission(self, request, view):
        # Staff/admin users can access
        if request.user.is_staff:
            return True

        # Company admins can access if it is related to their company
        company_admin = request.user.profile.admin_companies.exists()

        if view.action in ['list', 'retrieve']:
            # Allow access if they are company admins and there's a job post in the request
            job_post_id = view.kwargs.get('job_post_id')
            if job_post_id:
                return company_admin and request.user.profile.admin_companies.filter(jobpost__id=job_post_id).exists()

        return False

    def has_object_permission(self, request, view, obj):
        # Staff/admin users can access any object
        if request.user.is_staff:
            return True

        # Company admins can access applications related to their job postings
        if obj.job_post.company in request.user.profile.admin_companies.all():
            return True

        # Allow the applicant to view their own application
        if request.user.profile == obj.applicant:
            return True

        return False

class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'employee'
