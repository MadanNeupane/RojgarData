from django.utils.translation import gettext as _
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import Profile
from .serializers import ProfileSerializer


class ProfileViewSet(CreateModelMixin, RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admins can view all profiles
        if self.request.user.is_staff:
            return Profile.objects.all()

        # Users can only view their own profile
        return Profile.objects.filter(user=self.request.user)

    def get_permissions(self):
        # Only admins can create profiles
        if self.action == 'create':
            self.permission_classes = [IsAuthenticated, IsAdminUser]
        # Only admins or the owner can update profiles
        elif self.action in ['update', 'partial_update']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def perform_update(self, serializer):
        # Ensure the user can only update their own profile
        instance = serializer.instance
        if instance.user != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied(_('You can only update your own profile.'))
        serializer.save()

    @action(detail=False, methods=['get', 'put'], url_path='me')
    def me(self, request):
        """
        Get or update the profile of the currently authenticated user.
        """
        try:
            profile = self.get_queryset().get(user=request.user)
        except Profile.DoesNotExist:
            raise NotFound(_("Profile not found for the authenticated user."))

        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)

        elif request.method == 'PUT':
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
