from django.utils.translation import gettext as _
from rest_framework import serializers
from .models import (
    Company,
    SocialLink,
    CompanyReview,
    ReviewAspectScore,
    CompanyUpdateSuggestion,
    ReviewSpamReport,
    CompanyQuestion,
    CompanyAnswer,
)


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['platform', 'url']

class ReviewAspectScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewAspectScore
        fields = ['aspect', 'score']


class CompanyReviewSerializer(serializers.ModelSerializer):
    aspect_scores = ReviewAspectScoreSerializer(many=True)

    class Meta:
        model = CompanyReview
        fields = ['id', 'company', 'user', 'rating', 'review_text', 'aspect_scores', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError(_('Rating must be between 1 and 5'))
        return value

    def validate_aspect_scores(self, value):
        for aspect_score in value:
            if aspect_score.get('score', 0) < 1 or aspect_score.get('score', 0) > 5:
                raise serializers.ValidationError(_('Aspect scores must be between 1 and 5'))
        return value

    def create(self, validated_data):
        aspect_scores_data = validated_data.pop('aspect_scores', [])
        review = CompanyReview.objects.create(**validated_data)
        for aspect_score_data in aspect_scores_data:
            ReviewAspectScore.objects.create(review=review, **aspect_score_data)
        return review


class CompanyUpdateSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyUpdateSuggestion
        fields = ['id', 'company', 'suggested_by', 'field_name', 'suggested_value', 'reason', 'created_at', 'reviewed']
        read_only_fields = ['id', 'created_at', 'suggested_by', 'reviewed']


class ReviewSpamReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewSpamReport
        fields = ['id', 'review', 'reporter', 'reason', 'created_at']
        read_only_fields = ['id', 'created_at', 'reporter']


class CompanyQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyQuestion
        fields = ['id', 'company', 'asked_by', 'question_text', 'created_at', 'answered']
        read_only_fields = ['id', 'created_at', 'asked_by', 'answered']


class CompanyAnswerSerializer(serializers.ModelSerializer):
    question = CompanyQuestionSerializer(read_only=True)

    class Meta:
        model = CompanyAnswer
        fields = ['id', 'question', 'answered_by', 'answer_text', 'created_at']
        read_only_fields = ['id', 'created_at', 'answered_by']



class CompanySerializer(serializers.ModelSerializer):
    social_links = SocialLinkSerializer(many=True, read_only=True)
    reviews = CompanyReviewSerializer(many=True, read_only=True)
    questions = CompanyQuestionSerializer(many=True, read_only=True)
    visit_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Company
        fields = [
            'id', 'name', 'description', 'logo', 'cover_image', 'company_size', 'industry',
            'phone_number', 'location', 'work_emails', 'visit_count', 'social_links', 'reviews', 'questions',
        ]
