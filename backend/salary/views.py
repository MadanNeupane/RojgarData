from django.utils.translation import gettext as _
from rest_framework.permissions import BasePermission, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import SalarySubmission, SalaryReport
from .serializers import SalarySubmissionSerializer, SalaryReportSerializer
from .filters import SalarySubmissionFilter, SalaryReportFilter

class IsJobseeker(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'jobseeker'

class IsAdminOrOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_staff or obj.submitted_by.user == request.user

class SalarySubmissionViewSet(ModelViewSet):
    queryset = SalarySubmission.objects.all()
    serializer_class = SalarySubmissionSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = SalarySubmissionFilter
    ordering_fields = ['created_at', 'salary_amount', 'total_reports']  # Enable sorting by total_reports
    ordering = ['-created_at']  # Default ordering

    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [IsAuthenticated, IsJobseeker]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated, IsAdminOrOwner]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(submitted_by=self.request.user.profile)

class SalaryReportViewSet(ModelViewSet):
    queryset = SalaryReport.objects.all()
    serializer_class = SalaryReportSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = SalaryReportFilter
    ordering = ['-created_at']

    def perform_create(self, serializer):
        if SalaryReport.objects.filter(salary_submission=serializer.validated_data['salary_submission'], reporter=self.request.user.profile).exists():
            raise ValidationError(_('You have already reported this salary.'))
        serializer.save(reporter=self.request.user.profile)
