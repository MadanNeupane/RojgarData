from django.db import models
from company.models import Company
from accounts.models import Profile
from employee.models import EmployeeProfile


class JobPost(models.Model):
    company = models.ForeignKey(Company, related_name='job_posts', on_delete=models.CASCADE)
    posted_by = models.ForeignKey(Profile, related_name='job_posts', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills = models.ManyToManyField('Skill', blank=True)
    location = models.CharField(max_length=255)
    salary = models.CharField(max_length=255)
    deadline = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company.name}"

    class Meta:
        ordering = ['-created_at']


class Skill(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class JobApplication(models.Model):
    job_post = models.ForeignKey(JobPost, related_name='applications', on_delete=models.CASCADE)
    applicant = models.ForeignKey(EmployeeProfile, related_name='job_applications', on_delete=models.CASCADE)
    cover_letter = models.TextField()
    resume = models.FileField(upload_to='job_applications/', blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application by {self.applicant.profile.user.username} for {self.job_post.title}"
