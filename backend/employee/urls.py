from rest_framework.routers import DefaultRouter
from .views import EmployeeProfileViewSet

router = DefaultRouter()
router.register(r'profiles', EmployeeProfileViewSet, basename='employee-profile')

urlpatterns = router.urls
