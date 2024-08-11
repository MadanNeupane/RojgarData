from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import User, Profile
from employee.models import EmployeeProfile

@receiver(post_save, sender=User)
# Create a profile when a user is created
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
# Create an employee profile when a user with role 'employee' is created
def create_employee_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'employee':
        EmployeeProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

@receiver(post_save, sender=User)
def save_employee_profile(sender, instance, **kwargs):
    instance.employee_profile.save()
