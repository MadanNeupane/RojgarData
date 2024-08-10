from rest_framework.routers import DefaultRouter
from .views import SalarySubmissionViewSet, SalaryReportViewSet

router = DefaultRouter()
router.register(r'salaries', SalarySubmissionViewSet, basename='salary-submission')
router.register(r'reports', SalaryReportViewSet, basename='salary-report')

urlpatterns = router.urls
