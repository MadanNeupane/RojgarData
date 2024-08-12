import django_filters
from .models import JobseekerProfile

class JobseekerProfileFilter(django_filters.FilterSet):
    job_title = django_filters.CharFilter(field_name='job_title', lookup_expr='icontains')
    skills = django_filters.CharFilter(field_name='skills__name', lookup_expr='icontains')
    languages = django_filters.CharFilter(field_name='languages__name', lookup_expr='icontains')
    preferred_jobs = django_filters.CharFilter(field_name='preferred_jobs', lookup_expr='icontains')

    class Meta:
        model = JobseekerProfile
        fields = ['job_title', 'skills', 'languages', 'profile_visibility', 'preferred_jobs']
