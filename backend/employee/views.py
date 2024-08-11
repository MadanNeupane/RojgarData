from django.utils.translation import gettext as _
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import EmployeeProfile
from .serializers import EmployeeProfileSerializer
from .permissions import ProfileVisibilityPermission


class EmployeeProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployeeProfile.objects.all()
    serializer_class = EmployeeProfileSerializer
    permission_classes = [ProfileVisibilityPermission]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        # Start with public profiles
        visible_profiles = EmployeeProfile.objects.filter(profile_visibility=EmployeeProfile.PUBLIC)

        if self.request.user.is_authenticated:
            # Include authenticated-visible profiles
            visible_profiles = visible_profiles | EmployeeProfile.objects.filter(profile_visibility=EmployeeProfile.AUTHENTICATED)

            # If the user is an employer, include employer-visible profiles
            if self.request.user.role == 'employer':
                visible_profiles = visible_profiles | EmployeeProfile.objects.filter(profile_visibility=EmployeeProfile.EMPLOYER)

            # Include self profile in query
            visible_profiles = visible_profiles | EmployeeProfile.objects.filter(profile__user=self.request.user)

        # Distinct to prevent duplicate profiles
        return visible_profiles.distinct()

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
