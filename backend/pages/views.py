from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)

    #     # Send email to admin
    #     self.send_email_to_admin(serializer.data)

    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # def send_email_to_admin(self, data):
    #     send_mail(
    #         subject=f"New {data['topic']} from {data['name']}: {data['subject']}",
    #         message=data['message'],
    #         from_email=data['email'],
    #         recipient_list=['admin@rojgardata.com'],
    #         fail_silently=False,
    #     )

