from rest_framework import serializers
from .models import EmployeeProfile, Skill, Language, Experience, Education, Training


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name']


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ['id', 'company_name', 'job_title', 'start_date', 'end_date', 'description', 'current']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'institution', 'degree', 'start_date', 'end_date', 'description', 'current']


class TrainingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Training
        fields = ['id', 'institution', 'title', 'start_date', 'end_date', 'description', 'current']


class EmployeeProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    languages = LanguageSerializer(many=True, read_only=True)
    experiences = ExperienceSerializer(many=True, read_only=True)
    educations = EducationSerializer(many=True, read_only=True)
    trainings = TrainingSerializer(many=True, read_only=True)

    class Meta:
        model = EmployeeProfile
        fields = ['id', 'profile', 'resume', 'skills', 'languages', 'experiences', 'educations', 'trainings']
