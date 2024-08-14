from rest_framework import mixins, viewsets
from django.views.generic import TemplateView
from .models import Contact
from .serializers import ContactSerializer

class ContactViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

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


# Non API Views
# pages/views.py

from django.views.generic import TemplateView

class HomePageView(TemplateView):
    template_name = 'pages/home.html'

class AboutView(TemplateView):
    template_name = 'pages/about.html'

class ContactView(TemplateView):
    template_name = 'pages/contact.html'

class PrivacyPolicyView(TemplateView):
    template_name = 'pages/privacy_policy.html'

class TermsOfServiceView(TemplateView):
    template_name = 'pages/terms_of_service.html'
