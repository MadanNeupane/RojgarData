from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from .models import Achievement, ScoreLog, ProfileAchievement
from .serializers import (
    AchievementSerializer, ScoreLogSerializer,
    ProfileAchievementSerializer
)


class AchievementViewSet(ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['points_required']


class ScoreLogViewSet(ReadOnlyModelViewSet):
    serializer_class = ScoreLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScoreLog.objects.filter(profile=self.request.user.profile)

class ProfileAchievementViewSet(ReadOnlyModelViewSet):
    serializer_class = ProfileAchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProfileAchievement.objects.filter(profile=self.request.user.profile)
