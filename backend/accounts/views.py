from django.utils.translation import gettext as _
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.mixins import CreateModelMixin, RetrieveModelMixin, UpdateModelMixin
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import Profile, VerificationRequest
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

    @action(detail=True, methods=['post'], url_path='submit-verification')
    def submit_verification(self, request, pk=None):
        """
        Allow authenticated users to submit a verification request if not verified.
        """
        profile = self.get_object()
        if profile.is_verified:
            return Response({"detail": _("Your profile is already verified.")}, status=400)

        if VerificationRequest.objects.filter(profile=profile).exists():
            return Response({"detail": _("A verification request is already pending.")}, status=400)

        VerificationRequest.objects.create(profile=profile)
        return Response({"detail": _("Verification request submitted successfully.")})

    @action(detail=True, methods=['post'], url_path='approve-verification', permission_classes=[IsAdminUser])
    def approve_verification(self, request, pk=None):
        """
        Allow admins to approve verification requests.
        """
        profile = self.get_object()
        try:
            verification_request = profile.verification_request
        except VerificationRequest.DoesNotExist:
            return Response({"detail": _("No verification request found.")}, status=404)

        if verification_request.approved:
            return Response({"detail": _("This request is already approved.")}, status=400)

        verification_request.approve()
        return Response({"detail": _("Verification request approved successfully.")})
