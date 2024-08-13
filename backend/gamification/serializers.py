from rest_framework import serializers
from .models import Achievement, ScoreLog, ProfileAchievement


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'points_required', 'related_action', 'icon']


class ScoreLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreLog
        fields = ['id', 'profile', 'action', 'points', 'created_at']

    def create(self, validated_data):
        # Create and return a new ScoreLog instance, automatically checking achievements
        score_log = ScoreLog.objects.create(**validated_data)
        score_log.check_for_achievements()
        return score_log


class ProfileAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)

    class Meta:
        model = ProfileAchievement
        fields = ['id', 'profile', 'achievement', 'achieved_at']

    def to_representation(self, instance):
        # Customize representation to include achievement details
        representation = super().to_representation(instance)
        achievement = instance.achievement
        representation['achievement'] = {
            'id': achievement.id,
            'name': achievement.name,
            'description': achievement.description,
            'icon': achievement.icon.url if achievement.icon else None
        }
        return representation
