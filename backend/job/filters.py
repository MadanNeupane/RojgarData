import django_filters
from .models import JobPost, Skill, JobApplication

class JobPostFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    skills = django_filters.ModelMultipleChoiceFilter(
        field_name='skills__name',
        queryset=Skill.objects.all(),
        to_field_name='name',
        conjoined=True  # Ensure all selected skills are matched
    )
    company = django_filters.CharFilter(field_name='company__name', lookup_expr='icontains')
    min_salary = django_filters.NumberFilter(field_name='salary', lookup_expr='gte', method='filter_salary')
    max_salary = django_filters.NumberFilter(field_name='salary', lookup_expr='lte', method='filter_salary')
    is_active = django_filters.BooleanFilter(field_name='is_active')

    class Meta:
        model = JobPost
        fields = ['title', 'location', 'skills', 'company']

    def filter_salary(self, queryset, name, value):
        try:
            salary_int = int(value)
            return queryset.filter(**{name: salary_int})
        except ValueError:
            return queryset.none()


class JobApplicationFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(field_name='status', choices=JobApplication.STATUS_CHOICES)
    applicant = django_filters.CharFilter(field_name='applicant__profile__user__username', lookup_expr='icontains')
    job_post = django_filters.CharFilter(field_name='job_post__title', lookup_expr='icontains')
    company = django_filters.CharFilter(field_name='job_post__company__name', lookup_expr='icontains')
    submitted_after = django_filters.DateTimeFilter(field_name='submitted_at', lookup_expr='gte')
    submitted_before = django_filters.DateTimeFilter(field_name='submitted_at', lookup_expr='lte')

    class Meta:
        model = JobApplication
        fields = ['status', 'applicant', 'job_post', 'submitted_at']
