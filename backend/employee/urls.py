from rest_framework import routers

from .views import EmployeeProfileViewSet

router = routers.DefaultRouter()
router.register('', EmployeeProfileViewSet, basename='employee')
urlpatterns = router.urls
