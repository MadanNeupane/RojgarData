import django_filters
from .models import BlogPost, Tag, GuestArticleSubmission
from . import choices

class BlogPostFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    category = django_filters.ChoiceFilter(field_name='category', choices=choices.BLOG_CATEGORY_CHOICES)
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name='tags__name',
        queryset=Tag.objects.all(),
        to_field_name='name',
        conjoined=True  # Ensures all selected tags are matched
    )
    author = django_filters.CharFilter(field_name='author__username', lookup_expr='icontains')
    associated_company = django_filters.CharFilter(field_name='associated_company__name', lookup_expr='icontains')
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = BlogPost
        fields = ['title', 'category', 'tags', 'author', 'associated_company']


class GuestArticleSubmissionFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    category = django_filters.ChoiceFilter(field_name='category', choices=choices.BLOG_CATEGORY_CHOICES)
    tags = django_filters.ModelMultipleChoiceFilter(
        field_name='tags__name',
        queryset=Tag.objects.all(),
        to_field_name='name',
        conjoined=True
    )
    author_name = django_filters.CharFilter(field_name='author_name', lookup_expr='icontains')
    associated_company = django_filters.CharFilter(field_name='associated_company__name', lookup_expr='icontains')
    approved = django_filters.BooleanFilter(field_name='approved')
    submitted_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    submitted_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = GuestArticleSubmission
        fields = ['title', 'category', 'tags', 'author_name', 'associated_company', 'approved']
