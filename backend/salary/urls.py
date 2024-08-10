from rest_framework.routers import DefaultRouter
from .views import SalarySubmissionViewSet, SalaryReportViewSet

router = DefaultRouter()
router.register(r'salaries', SalarySubmissionViewSet, basename='salarysubmission')
router.register(r'reports', SalaryReportViewSet, basename='salaryreport')

urlpatterns = router.urls
