from rest_framework.serializers import ModelSerializer
from .models import Achievement, ScoreLog, ProfileAchievement
from accounts.models import Profile


class AchievementSerializer(ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'points_required', 'reward']


class ScoreLogSerializer(ModelSerializer):
    class Meta:
        model = ScoreLog
        fields = ['id', 'profile', 'action', 'points', 'created_at']

class ProfileAchievementSerializer(ModelSerializer):
    achievement = AchievementSerializer()

    class Meta:
        model = ProfileAchievement
        fields = ['id', 'profile', 'achievement', 'achieved_at']
