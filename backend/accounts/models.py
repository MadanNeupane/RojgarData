from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from . import choices


class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    role = models.CharField(max_length=10, choices=choices.USER_ROLE_CHOICES, default='jobseeker')
    subscription_type = models.CharField(max_length=10, choices=choices.ACCOUNT_SUBSCRIPTION_TYPE_CHOICES, default='free')
    has_contributed = models.BooleanField(default=False, help_text="Flag to indicate if the user has made a donation")


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    birth_date = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    reputation_points = models.PositiveIntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def add_reputation(self, amount):
        self.reputation_points += amount
        self.save()

    def __str__(self):
        return f"{self.user.username}'s Profile"


class SocialLink(models.Model):
    profile = models.ForeignKey(Profile, related_name='social_links', on_delete=models.CASCADE)
    platform = models.CharField(max_length=255, choices=choices.SOCIAL_PLATFORM_CHOICES)
    url = models.URLField()

    def __str__(self):
        return f"{self.platform}: {self.url}"

    class Meta:
        unique_together = ('profile', 'platform')

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
            'reddit': 'reddit.com/',
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

class VerificationRequest(models.Model):
    profile = models.OneToOneField(
        'Profile',
        on_delete=models.CASCADE,
        related_name='verification_request'
    )
    approved = models.BooleanField(default=False)
    requested_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = _("Verification Request")
        verbose_name_plural = _("Verification Requests")

    def __str__(self):
        return f"Verification request for {self.profile.user.username}"

    def approve(self):
        """ Approve the verification request and update the profile. """
        if not self.approved:
            self.approved = True
            self.reviewed_at = datetime.now()
            self.profile.is_verified = True
            self.profile.save()
            self.save()

    def clean(self):
        """ Ensure that only unverified profiles can submit verification requests. """
        super().clean()
        if self.profile.is_verified:
            raise ValidationError(_("This profile is already verified."))
