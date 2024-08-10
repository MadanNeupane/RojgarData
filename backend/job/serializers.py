from rest_framework import serializers
from .models import JobPost, JobApplication, JobBookmark, Skill

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']

class JobPostSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = JobPost
        fields = [
            'id', 'company', 'posted_by', 'title', 'description', 'skills',
            'location', 'salary', 'deadline', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'posted_by']

class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = ['id', 'job_post', 'applicant', 'cover_letter', 'resume', 'submitted_at']
        read_only_fields = ['id', 'submitted_at', 'applicant']

class JobBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobBookmark
        fields = ['id', 'job_post', 'employee', 'added_at']
        read_only_fields = ['id', 'added_at', 'employee']
