from rest_framework.routers import DefaultRouter
from .views import JobPostViewSet, JobApplicationViewSet, JobBookmarkViewSet

router = DefaultRouter()
router.register(r'posts', JobPostViewSet, basename='job-post')
router.register(r'applications', JobApplicationViewSet, basename='job-application')
router.register(r'bookmarks', JobBookmarkViewSet, basename='job-bookmark')

urlpatterns = router.urls
