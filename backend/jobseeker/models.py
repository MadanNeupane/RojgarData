from django.db import models
from accounts.models import Profile

class JobseekerProfile(models.Model):

    PUBLIC = 'public'
    EMPLOYER = 'employer'
    AUTHENTICATED = 'authenticated'
    PRIVATE = 'private'

    VISIBILITY_CHOICES = [
        (PUBLIC, 'Public'),
        (EMPLOYER, 'Employer'),
        (AUTHENTICATED, 'Authenticated Users'),
        (PRIVATE, 'Private')
    ]

    profile = models.OneToOneField(Profile, on_delete=models.CASCADE)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    skills = models.ManyToManyField('Skill', blank=True)
    languages = models.ManyToManyField('Language', blank=True)
    profile_visibility = models.CharField(
        max_length=20,
        choices=VISIBILITY_CHOICES,
        default=PRIVATE
    )
    job_title = models.CharField(max_length=255, blank=True)
    preferred_jobs = models.JSONField(blank=True, null=True)  # Assuming preferred jobs are stored as a list of job titles

    def __str__(self):
        return f"{self.profile.user.username}'s Profile"

class BaseProfileRecord(models.Model):
    profile = models.ForeignKey(Profile, related_name='%(class)ss', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)  # null for ongoing records
    description = models.TextField(blank=True)
    current = models.BooleanField(default=False, help_text="Flag to indicate if this is ongoing")

    class Meta:
        abstract = True
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.profile.user.username}'s {self.__class__.__name__}"

class Experience(BaseProfileRecord):
    company_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.profile.user.username}'s Experience at {self.company_name}"

class Education(BaseProfileRecord):
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.profile.user.username}'s Education at {self.institution}"

class Training(BaseProfileRecord):
    institution = models.CharField(max_length=255)
    title = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.profile.user.username}'s Training at {self.institution}"

class Skill(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Language(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
