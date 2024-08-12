from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import User, Profile
from jobseeker.models import JobseekerProfile

@receiver(post_save, sender=User)
# Create a profile when a user is created
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
# Create an jobseeker profile when a user with role 'jobseeker' is created
def create_jobseeker_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'jobseeker':
        JobseekerProfile.objects.create(profile=instance.profile)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=User)
def save_jobseeker_profile(sender, instance, **kwargs):
    instance.profile.save()
