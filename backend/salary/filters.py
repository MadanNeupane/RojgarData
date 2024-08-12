import django_filters
from company.models import Company
from .models import SalarySubmission, SalaryReport

class SalarySubmissionFilter(django_filters.FilterSet):
    # company = django_filters.ModelChoiceFilter(queryset=SalarySubmission.objects.values_list('company', flat=True).distinct())
    company = django_filters.ModelChoiceFilter(queryset=Company.objects.all())
    job_title = django_filters.CharFilter(field_name='job_title', lookup_expr='icontains')
    salary_min = django_filters.NumberFilter(field_name='salary_amount', lookup_expr='gte')
    salary_max = django_filters.NumberFilter(field_name='salary_amount', lookup_expr='lte')
    currency = django_filters.ChoiceFilter(field_name='currency', choices=[('NPR', 'NPR'), ('USD', 'USD'), ('EUR', 'EUR')])
    payment_period = django_filters.ChoiceFilter(field_name='payment_period', choices=[('month', 'Month'), ('week', 'Week'), ('hour', 'Hour'), ('year', 'Year')])
    years_of_experience = django_filters.RangeFilter(field_name='years_of_experience')
    seniority = django_filters.ChoiceFilter(field_name='seniority', choices=SalarySubmission.SENIORITY_LEVELS)
    is_verified = django_filters.BooleanFilter(field_name='is_verified')


    class Meta:
        model = SalarySubmission
        fields = [
            'company', 'job_title', 'currency',
            'payment_period', 'years_of_experience', 'seniority',
            'is_verified'
        ]

class SalaryReportFilter(django_filters.FilterSet):
    salary_submission = django_filters.CharFilter(field_name='salary_submission__job_title', lookup_expr='icontains')
    reporter = django_filters.CharFilter(field_name='reporter__user__username', lookup_expr='icontains')


    class Meta:
        model = SalaryReport
        fields = ['salary_submission', 'reporter']
