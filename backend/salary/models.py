from django.db import models
from django.utils.translation import gettext_lazy as _
from company.models import Company
from employee.models import EmployeeProfile


class SalarySubmission(models.Model):
    company = models.ForeignKey(Company, related_name='salary_submissions', on_delete=models.CASCADE)
    submitted_by = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    anonymous = models.BooleanField(default=True)
    job_title = models.CharField(max_length=255)
    salary_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=[('NPR', 'NPR'), ('USD', 'USD'), ('EUR', 'EUR')])
    payment_period = models.CharField(max_length=10, choices=[('month', 'Month'), ('week', 'Week'), ('hour', 'Hour'), ('year', 'Year')])
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return _(f"Salary submission for {self.job_title} at {self.company.name} by {self.submitted_by.user.username}")
