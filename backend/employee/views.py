from django.utils.translation import gettext_lazy as _
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer
from .permissions import IsAdminOrIsSelf


class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminOrIsSelf]

    def get_queryset(self):
        # Admins can view all profiles
        if self.request.user.is_staff:
            return EmployeeProfile.objects.all()

        # Users can only view their own profile
        return EmployeeProfile.objects.filter(profile__user=self.request.user)

    def perform_update(self, serializer):
        # Ensure the user can only update their own profile
        instance = serializer.instance
        if instance.profile.user != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied(_('You can only update your own profile.'))
        serializer.save()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Get the profile of the currently authenticated user.
        If the profile does not exist for an employee user, create it.
        """
        user = request.user

        # Check if the user has the role 'employee'
        if user.role == 'employee':
            profile, created = EmployeeProfile.objects.get_or_create(profile__user=user)

            # If the profile was created, populate default values if needed
            if created:
                # You can set default values here if necessary
                profile.save()

            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        else:
            raise NotFound(_('Employee profile not found.'))

