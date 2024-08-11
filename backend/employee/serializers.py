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
        fields = ['id', 'profile', 'resume', 'skills', 'languages', 'experiences', 'educations', 'trainings', 'profile_visibility', 'job_title', 'preferred_jobs']

    def get_resume(self, obj):
        """
        Return the resume URL if the user is an admin or the profile belongs to the requesting user.
        """
        request = self.context.get('request')
        if request and (request.user.is_staff or obj.profile.user == request.user):
            return obj.resume.url if obj.resume else None
        return None

    def to_representation(self, instance):
        """
        Customize representation based on user permissions.
        """
        representation = super().to_representation(instance)
        request = self.context.get('request')

        # Hide the resume field if the user is not an admin or the profile doesn't belong to the user
        if request and not (request.user.is_staff or instance.profile.user == request.user):
            representation.pop('resume', None)

        return representation