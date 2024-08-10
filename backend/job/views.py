from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import JobPost, JobApplication, JobBookmark
from .serializers import JobPostSerializer, JobApplicationSerializer, JobBookmarkSerializer
from .permissions import IsAdminOrCompanyAdmin, IsEmployee
from rest_framework.exceptions import ValidationError

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

    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user.profile)

class JobApplicationViewSet(ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, IsEmployee]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        if JobApplication.objects.filter(job_post=serializer.validated_data['job_post'], applicant=self.request.user.profile.employeeprofile).exists():
            raise ValidationError(_('You have already applied for this job.'))
        serializer.save(applicant=self.request.user.profile.employeeprofile)

class JobBookmarkViewSet(ModelViewSet):
    queryset = JobBookmark.objects.all()
    serializer_class = JobBookmarkSerializer

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, IsEmployee]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        if JobBookmark.objects.filter(job_post=serializer.validated_data['job_post'], employee=self.request.user.profile.employeeprofile).exists():
            raise ValidationError(_('You have already bookmarked this job.'))
        serializer.save(employee=self.request.user.profile.employeeprofile)
