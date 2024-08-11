from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import CompanyViewSet, CompanyReviewViewSet, CompanyQuestionViewSet, CompanyAnswerViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet)

# Nested routers for reviews and questions
companies_router = NestedDefaultRouter(router, r'companies', lookup='company')
companies_router.register(r'reviews', CompanyReviewViewSet, basename='company-reviews')
companies_router.register(r'questions', CompanyQuestionViewSet, basename='company-questions')

# Nested router for answers under questions
questions_router = NestedDefaultRouter(companies_router, r'questions', lookup='question')
questions_router.register(r'answers', CompanyAnswerViewSet, basename='company-answers')

urlpatterns = router.urls + companies_router.urls + questions_router.urls
