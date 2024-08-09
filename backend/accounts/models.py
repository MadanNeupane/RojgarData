from django.db import models
from django.contrib.auth.models import AbstractUser
from . import choices


class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    role = models.CharField(max_length=10, choices=choices.USER_ROLE_CHOICES, default='employee')
    subscription_type = models.CharField(max_length=10, choices=choices.ACCOUNT_SUBSCRIPTION_TYPE_CHOICES, default='free')
    has_contributed = models.BooleanField(default=False, help_text="Flag to indicate if the user has made a donation")


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    birth_date = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    reputation_points = models.PositiveIntegerField(default=0)
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
