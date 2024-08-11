from django.utils.translation import gettext as _
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework import status
from .models import JobPost, JobApplication, JobBookmark
from .serializers import JobPostSerializer, JobApplicationSerializer, JobBookmarkSerializer
from .permissions import IsAdminOrCompanyAdmin, IsEmployee


class JobPostViewSet(ModelViewSet):
    queryset = JobPost.objects.all()
    serializer_class = JobPostSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsAdminOrCompanyAdmin]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        job_post = self.get_object()

        # Increment the view count
        job_post.view_count += 1
        job_post.save(update_fields=['view_count'])

        serializer = self.get_serializer(job_post)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user.profile)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsEmployee])
    def bookmark(self, request, pk=None):
        job_post = self.get_object()
        employee = request.user.profile.employeeprofile
        bookmark, created = JobBookmark.objects.get_or_create(employee=employee, job_post=job_post)
        if not created:
            return Response({'status': 'already bookmarked'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'bookmarked'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsEmployee])
    def remove_bookmark(self, request, pk=None):
        job_post = self.get_object()
        employee = request.user.profile.employeeprofile
        try:
            bookmark = JobBookmark.objects.get(employee=employee, job_post=job_post)
            bookmark.delete()
            return Response({'status': 'bookmark removed'})
        except JobBookmark.DoesNotExist:
            return Response({'status': 'bookmark not found'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsEmployee])
    def my_bookmarks(self, request):
        employee = request.user.profile.employeeprofile
        bookmarks = JobBookmark.objects.filter(employee=employee)
        serializer = JobBookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)


class JobApplicationViewSet(ModelViewSet):
    serializer_class = JobApplicationSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return JobApplication.objects.all()

        # If the user is a company admin, return applications related to their company's job posts
        if user.profile.admin_companies.exists():
            return JobApplication.objects.filter(job_post__company__in=user.profile.admin_companies.all())

        # If the user is an employee, return only their job applications
        if user.role == 'employee':
            return JobApplication.objects.filter(applicant=user.profile.employeeprofile)

        # Default to empty queryset if none of the above conditions are met
        return JobApplication.objects.none()

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated, IsEmployee]
        else:
            permission_classes = [IsAuthenticated, IsAdminOrCompanyAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Check if the user has already applied to the job post
        if JobApplication.objects.filter(
            job_post=serializer.validated_data['job_post'],
            applicant=self.request.user.profile.employeeprofile
        ).exists():
            raise ValidationError(_('You have already applied for this job.'))

        # Save the job application
        serializer.save(applicant=self.request.user.profile.employeeprofile)
