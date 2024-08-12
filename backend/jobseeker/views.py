from django.utils.translation import gettext as _
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import JobseekerProfile
from .serializers import JobseekerProfileSerializer
from .permissions import ProfileVisibilityPermission
from .filters import JobseekerProfileFilter


class JobseekerProfileViewSet(ModelViewSet):
    queryset = JobseekerProfile.objects.all()
    serializer_class = JobseekerProfileSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = JobseekerProfileFilter
    search_fields = ['job_title', 'skills__name', 'languages__name', 'preferred_jobs']
    ordering_fields = ['job_title', 'profile_visibility']
    ordering = ['job_title']  # Default ordering

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Allow unauthenticated users to view profiles with public visibility
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        # Start with public profiles
        visible_profiles = JobseekerProfile.objects.filter(profile_visibility=JobseekerProfile.PUBLIC)

        if self.request.user.is_authenticated:
            # Include authenticated-visible profiles
            visible_profiles = visible_profiles | JobseekerProfile.objects.filter(profile_visibility=JobseekerProfile.AUTHENTICATED)

            # If the user is an employer, include employer-visible profiles
            if self.request.user.role == 'employer':
                visible_profiles = visible_profiles | JobseekerProfile.objects.filter(profile_visibility=JobseekerProfile.EMPLOYER)

            # Include self profile in query
            visible_profiles = visible_profiles | JobseekerProfile.objects.filter(profile__user=self.request.user)

        # Distinct to prevent duplicate profiles
        return visible_profiles.distinct()

    def perform_update(self, serializer):
        # Ensure the user can only update their own profile
        instance = serializer.instance
        if instance.profile.user != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied(_('You can only update your own profile.'))
        serializer.save()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        Get the profile of the currently authenticated user.
        """
        user = request.user

        # Check if the user has the role 'jobseeker'
        if user.role == 'jobseeker':
            profile = JobseekerProfile.objects.get(profile__user=user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        else:
            raise NotFound(_('Jobseeker profile not found.'))
