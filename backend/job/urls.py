from rest_framework.routers import DefaultRouter
from .views import JobPostViewSet, JobApplicationViewSet

router = DefaultRouter()
router.register(r'posts', JobPostViewSet, basename='job-post')
router.register(r'applications', JobApplicationViewSet, basename='job-application')

urlpatterns = router.urls
