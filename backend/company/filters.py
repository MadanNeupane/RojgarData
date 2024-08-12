import django_filters
from django.db.models import Count
from .models import Company, CompanyReview, ReviewAspectScore, CompanyQuestion, CompanyAnswer
from . import choices

class CompanyFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    industry = django_filters.ChoiceFilter(field_name='industry', choices=choices.INDUSTRY_CHOICES)
    company_size = django_filters.ChoiceFilter(field_name='company_size', choices=choices.COMPANY_SIZE_CHOICES)

    class Meta:
        model = Company
        fields = ['name', 'industry', 'location', 'company_size']


class CompanyReviewFilter(django_filters.FilterSet):
    review_text = django_filters.CharFilter(field_name='review_text', lookup_expr='icontains')
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')

    class Meta:
        model = CompanyReview
        fields = ['review_text']


class CompanyQuestionFilter(django_filters.FilterSet):
    question_text = django_filters.CharFilter(field_name='question_text', lookup_expr='icontains')

    class Meta:
        model = CompanyQuestion
        fields = ['question_text']
