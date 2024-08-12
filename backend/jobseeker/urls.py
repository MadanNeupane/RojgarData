from rest_framework.routers import DefaultRouter
from .views import JobseekerProfileViewSet

router = DefaultRouter()
router.register(r'profiles', JobseekerProfileViewSet, basename='jobseeker-profile')

urlpatterns = router.urls
