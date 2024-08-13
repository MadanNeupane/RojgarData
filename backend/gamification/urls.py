from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'achievements', views.AchievementViewSet)
router.register(r'score-logs', views.ScoreLogViewSet, basename='scorelog')
router.register(r'profile-achievements', views.ProfileAchievementViewSet, basename='profileachievement')

urlpatterns = router.urls
