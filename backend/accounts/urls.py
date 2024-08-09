from rest_framework import routers

from .views import ProfileViewSet

router = routers.DefaultRouter()
router.register('profile', ProfileViewSet, basename='profile')
urlpatterns = router.urls
