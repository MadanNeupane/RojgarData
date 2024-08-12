import django_filters
from django.db.models import Count
from .models import Company
from . import choices

class CompanyFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    industry = django_filters.ChoiceFilter(field_name='industry', choices=choices.INDUSTRY_CHOICES)
    company_size = django_filters.ChoiceFilter(field_name='company_size', choices=choices.COMPANY_SIZE_CHOICES)

    class Meta:
        model = Company
        fields = ['name', 'industry', 'location', 'company_size']
