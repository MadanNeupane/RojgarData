from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'achievements', views.AchievementViewSet)
router.register(r'badges', views.BadgeViewSet)
router.register(r'score-logs', views.ScoreLogViewSet, basename='scorelog')
router.register(r'profile-achievements', views.ProfileAchievementViewSet, basename='profileachievement')
router.register(r'profile-badges', views.ProfileBadgeViewSet, basename='profilebadge')


urlpatterns = router.urls
