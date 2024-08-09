from django.db import models
from django.contrib.auth.models import AbstractUser
from . import choices


class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    subscription_type = models.CharField(max_length=10, choices=choices.ACCOUNT_SUBSCRIPTION_TYPE_CHOICES, default='free')
    has_contributed = models.BooleanField(default=False, help_text="Flag to indicate if the user has made a donation")


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    cover_letter = models.FileField(upload_to='cover_letters/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username}\'s Profile'


class Experience(models.Model):
    profile = models.ForeignKey(Profile, related_name='experiences', on_delete=models.CASCADE)
    job_title = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)  # null for current jobs
    description = models.TextField(blank=True)

    def __str__(self):
        return f'{self.profile.user.username}\'s Experience at {self.company_name}'

    class Meta:
        ordering = ['-start_date']
