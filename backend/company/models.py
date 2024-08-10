from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext as _ # This one works, if others don't I'll use this everywhere
from accounts.models import Profile
from . import choices


class Company(models.Model):
    '''
    Stores information about a company
    '''

    name = models.CharField(max_length=255)
    description = models.TextField()
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    cover_image = models.ImageField(upload_to='company_cover_images/', null=True, blank=True)
    company_size = models.CharField(max_length=10, choices=choices.COMPANY_SIZE_CHOICES)
    industry = models.CharField(max_length=255, choices=choices.INDUSTRY_CHOICES)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    location = models.CharField(max_length=255)
    work_emails = models.JSONField(blank=True, null=True)  # List of work email domains
    visit_count = models.PositiveIntegerField(default=0)
    admins = models.ManyToManyField(Profile, related_name='admin_companies', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Companies'


class SocialLink(models.Model):
    '''
    Stores social links for a company
    '''

    company = models.ForeignKey(Company, related_name='social_links', on_delete=models.CASCADE)
    platform = models.CharField(max_length=255, choices=choices.SOCIAL_PLATFORM_CHOICES)
    url = models.URLField()

    def __str__(self):
        return f"{self.company} - {self.platform}: {self.url}"

    class Meta:
        unique_together = ('company', 'platform')

    def clean(self):
        super().clean()

        # Define URL patterns for each platform
        url_patterns = {
            'facebook': 'facebook.com/',
            'twitter': ('twitter.com/', 'x.com/'),
            'linkedin': 'linkedin.com/',
            'instagram': 'instagram.com/',
            'youtube': 'youtube.com/',
            'github': 'github.com/',
            'tiktok': 'tiktok.com/',
            'website': '',
        }

        platform = self.platform
        url = self.url

        # Validate the URL based on the platform
        if platform in url_patterns:
            expected_pattern = url_patterns[platform]
            if isinstance(expected_pattern, tuple):
                if not any(pattern in url for pattern in expected_pattern):
                    raise ValidationError(
                        _(f"URL for {platform} must contain one of the following: {', '.join(expected_pattern)}"),
                        code='invalid_url',
                    )
            else:
                if expected_pattern and expected_pattern not in url:
                    raise ValidationError(
                        _(f"URL for {platform} must contain '{expected_pattern}'"),
                        code='invalid_url',
                    )


class CompanyReview(models.Model):
    company = models.ForeignKey(Company, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(Profile, related_name='company_reviews', on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=0, validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('company', 'user')  # Ensure one review per user per company

    def __str__(self):
        return _(f"Review for {self.company.name} by {self.user.user.username}")


class ReviewAspectScore(models.Model):
    review = models.ForeignKey(CompanyReview, related_name='aspect_scores', on_delete=models.CASCADE)
    aspect = models.CharField(max_length=50, choices=choices.COMPANY_ASPECT_CHOICES)
    score = models.PositiveIntegerField(default=0, validators=[MinValueValidator(1), MaxValueValidator(5)])

    def __str__(self):
        return _(f"{self.review} - {self.get_aspect_display()} - {self.score}")


class CompanyUpdateSuggestion(models.Model):
    '''
    Allows users to suggest updates to company details
    '''

    company = models.ForeignKey(Company, related_name='update_suggestions', on_delete=models.CASCADE)
    suggested_by = models.ForeignKey(Profile, related_name='update_suggestions', on_delete=models.CASCADE)
    field_name = models.CharField(max_length=255, choices=choices.COMPANY_FIELD_NAME_CHOICES)
    suggested_value = models.TextField(help_text=_("Enter the new value for the field. In case of images, provide the link to the new image"))
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed = models.BooleanField(default=False)

    def __str__(self):
        return _(f"Suggestion by {self.suggested_by.user.username} for {self.company.name} ({self.field_name})")


class ReviewSpamReport(models.Model):
    '''
    Allows users to report spam on reviews
    '''

    review = models.ForeignKey(CompanyReview, related_name='spam_reports', on_delete=models.CASCADE)
    reporter = models.ForeignKey(Profile, related_name='spam_reports', on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('review', 'reporter')

    def __str__(self):
        return _(f"Spam report by {self.reporter.user.username} for {self.review}")


class CompanyQuestion(models.Model):
    '''
    Allows users to ask questions to a company
    '''

    company = models.ForeignKey(Company, related_name='questions', on_delete=models.CASCADE)
    asked_by = models.ForeignKey(Profile, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    answered = models.BooleanField(default=False)

    def __str__(self):
        return _(f"Question by {self.asked_by.user.username} to {self.company.name}")


class CompanyAnswer(models.Model):
    '''
    Stores answers from companies to user questions
    '''

    question = models.OneToOneField(CompanyQuestion, related_name='answer', on_delete=models.CASCADE)
    answered_by = models.ForeignKey(Profile, related_name='answers', on_delete=models.CASCADE)
    answer_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return _(f"Answer by {self.answered_by.user.username} to question {self.question.id}")
