from rest_framework.viewsets import GenericViewSet, ReadOnlyModelViewSet
from rest_framework.mixins import CreateModelMixin, ListModelMixin
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Achievement, ScoreLog, ProfileAchievement
from .serializers import AchievementSerializer, ScoreLogSerializer, ProfileAchievementSerializer


class AchievementViewSet(ReadOnlyModelViewSet):
    """
    A simple ViewSet for viewing achievements.
    """
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    permission_classes = [AllowAny]


class ScoreLogViewSet(GenericViewSet, CreateModelMixin, ListModelMixin):
    """
    A ViewSet for creating and listing score logs.
    """
    queryset = ScoreLog.objects.all()
    serializer_class = ScoreLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        else:
            return self.queryset.filter(profile__user=self.request.user)


class ProfileAchievementViewSet(ReadOnlyModelViewSet):
    """
    A ViewSet for viewing profile achievements.
    """
    serializer_class = ProfileAchievementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return achievements only for the authenticated user's profile
        user = self.request.user
        return ProfileAchievement.objects.filter(profile__user=user)
