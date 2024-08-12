from django.db import models
from django.utils.translation import gettext as _
from company.models import Company
from accounts.models import Profile
from jobseeker.models import JobseekerProfile


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
    view_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.title} at {self.company.name}"

    class Meta:
        ordering = ['-created_at']

    def total_bookmarks(self):
        return self.bookmarks.count()


class Skill(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ('opened', 'Opened'),
        ('selected', 'Selected'),
        ('rejected', 'Rejected'),
    ]

    job_post = models.ForeignKey(JobPost, related_name='applications', on_delete=models.CASCADE)
    applicant = models.ForeignKey(JobseekerProfile, related_name='job_applications', on_delete=models.CASCADE)
    cover_letter = models.TextField()
    resume = models.FileField(upload_to='job_applications/', blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='opened')

    def __str__(self):
        return _(f'{self.applicant.profile.user.username} applied for {self.job_post.title}')

    class Meta:
        unique_together = ('job_post', 'applicant')


class JobBookmark(models.Model):
    job_post = models.ForeignKey(JobPost, related_name='bookmarks', on_delete=models.CASCADE)
    jobseeker = models.ForeignKey(JobseekerProfile, related_name='job_bookmarks', on_delete=models.CASCADE)  # Changed related_name
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job_post', 'jobseeker')

    def __str__(self):
        return _(f'{self.jobseeker.profile.user.username} bookmarked {self.job_post.title}')
