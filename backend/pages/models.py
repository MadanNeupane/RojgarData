from django.db import models
from django.utils.translation import gettext as _


class Contact(models.Model):
    TOPIC_CHOICES = [
        ('general_enquiry', _('General Enquiry')),
        ('bug_report', _('Bug Report')),
        ('feature_request', _('Feature Request')),
        ('sponsorship', _('Sponsorship')),
        ('other', _('Other')),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField()
    topic = models.CharField(max_length=50, choices=TOPIC_CHOICES)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_topic_display()})"
