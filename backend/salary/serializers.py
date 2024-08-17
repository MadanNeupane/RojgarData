from django.utils.translation import gettext as _
from rest_framework import serializers
from .models import SalarySubmission, SalaryReport

class SalarySubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalarySubmission
        fields = [
            'id', 'company', 'submitted_by', 'anonymous', 'job_title', 'work_status', 'work_type',
            'years_of_experience', 'seniority', 'currency', 'salary_amount', 'payment_period',
            'bonus', 'bonus_payment_period','is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'submitted_by', 'is_verified']

    def validate_salary_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(_("Salary amount must be greater than zero."))
        return value

    def validate_years_of_experience(self, value):
        if value < 0:
            raise serializers.ValidationError(_("Years of experience must be zero or greater."))
        return value

    def validate_seniority(self, value):
        valid_choices = [choice[0] for choice in SalarySubmission.SENIORITY_LEVELS]
        if value not in valid_choices:
            raise serializers.ValidationError(_("Invalid seniority level."))
        return value

class SalaryReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalaryReport
        fields = ['id', 'salary_submission', 'reporter', 'reason', 'created_at']
        read_only_fields = ['id', 'created_at', 'reporter']
