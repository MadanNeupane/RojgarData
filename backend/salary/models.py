from django.db import models
from django.utils.translation import gettext as _
from company.models import Company
from accounts.models import Profile
from . import choices


class SalarySubmission(models.Model):
    company = models.ForeignKey(Company, related_name='salary_submissions', on_delete=models.SET_NULL, null=True)
    submitted_by = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    anonymous = models.BooleanField(default=True)
    job_title = models.CharField(max_length=255)
    salary_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=choices.CURRENCY_CHOICES)
    payment_period = models.CharField(max_length=10, choices=choices.PAYMENT_PERIOD_CHOICES)
    bonus = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    bonus_payment_period = models.CharField(max_length=10, choices=choices.PAYMENT_PERIOD_CHOICES, null=True, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    seniority = models.CharField(max_length=10, choices=choices.SENIORITY_LEVELS, default='junior')
    work_status = models.CharField(max_length=10, choices=choices.WORK_STATUS_CHOICES, default='current')
    work_type = models.CharField(max_length=10, choices=choices.WORK_TYPE_CHOICES, default='full_time')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return _(f"Salary submission for {self.job_title} at {self.company.name} by {self.submitted_by.user.username}")

    @property
    def total_reports(self):
        return self.reports.count()


class SalaryReport(models.Model):
    salary_submission = models.ForeignKey(SalarySubmission, related_name='reports', on_delete=models.CASCADE)
    reporter = models.ForeignKey(Profile, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('salary_submission', 'reporter')

    def __str__(self):
        return _(f"Report for {self.salary_submission} by {self.reporter.user.username}")
