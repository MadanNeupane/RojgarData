from rest_framework.routers import DefaultRouter
from .views import CompanyViewSet, CompanyReviewViewSet, CompanyQuestionViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'reviews', CompanyReviewViewSet, basename='company-review')
router.register(r'questions', CompanyQuestionViewSet, basename='company-question')

urlpatterns = router.urls
