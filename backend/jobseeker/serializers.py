# serializers.py

from rest_framework import serializers
from .models import JobseekerProfile, Skill, Language, Experience, Education, Training

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

class JobseekerProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, required=False)
    languages = LanguageSerializer(many=True, required=False)
    experiences = ExperienceSerializer(many=True, required=False, source='profile.experiences')
    educations = EducationSerializer(many=True, required=False, source='profile.educations')
    trainings = TrainingSerializer(many=True, required=False, source='profile.trainings')

    class Meta:
        model = JobseekerProfile
        fields = ['id', 'profile', 'resume', 'skills', 'languages', 'experiences', 'educations', 'trainings', 'profile_visibility', 'job_title', 'employment_status', 'preferred_jobs', 'preferred_locations', 'preferred_industry']

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

    def update(self, instance, validated_data):
        skills_data = validated_data.pop('skills', [])
        languages_data = validated_data.pop('languages', [])
        experiences_data = validated_data.pop('profile', {}).get('experiences', [])
        educations_data = validated_data.pop('profile', {}).get('educations', [])
        trainings_data = validated_data.pop('profile', {}).get('trainings', [])

        # Update or create skills
        for skill_data in skills_data:
            skill, created = Skill.objects.update_or_create(
                profile=instance,
                name=skill_data['name']
            )

        # Update or create languages
        for language_data in languages_data:
            language, created = Language.objects.update_or_create(
                profile=instance,
                name=language_data['name']
            )

        # Update or create experiences
        for experience_data in experiences_data:
            experience, created = Experience.objects.update_or_create(
                profile=instance.profile,
                company_name=experience_data['company_name'],
                defaults=experience_data
            )

        # Update or create educations
        for education_data in educations_data:
            education, created = Education.objects.update_or_create(
                profile=instance.profile,
                institution=education_data['institution'],
                degree=education_data['degree'],
                defaults=education_data
            )

        # Update or create trainings
        for training_data in trainings_data:
            training, created = Training.objects.update_or_create(
                profile=instance.profile,
                institution=training_data['institution'],
                title=training_data['title'],
                defaults=training_data
            )

        return super().update(instance, validated_data)
