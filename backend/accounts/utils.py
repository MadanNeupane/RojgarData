from django.core.mail import send_mail
from .models import Notification

def send_notification(user, subject, message, url=None):
    """
    Create and send a notification to a user.

    :param user: The user to notify (instance of User).
    :param message: The notification message (string).
    :param url: An optional URL to include in the notification (string).
    """
    profile = user.profile

    # Send push notification
    if profile.notify_push:
        Notification.objects.create(user=user, message=message, url=url)

    # Send email notification
    if profile.notify_email:
        send_mail(
            subject,
            message,
            'no-reply@rojgardata.com',
            [user.email],
            fail_silently=False,
        )

def notify_multiple_users(users, subject, message, url=None):
    """
    Send notifications to multiple users.

    :param users: A list or queryset of User instances.
    :param message: The notification message.
    :param url: An optional URL to include in the notification.
    """
    notifications = []
    emails = []
    for user in users:
        profile = user.profile
        if profile.notify_push:
            notifications.append(Notification(user=user, message=message, url=url))
        if profile.notify_email:
            emails.append(user.email)
    Notification.objects.bulk_create(notifications)

    if emails:
        send_mail(
            subject,
            message,
            'no-reply@rojgardata.com',
            emails,
            fail_silently=False,
        )
