from django.utils.translation import gettext as _

USER_ROLE_CHOICES = [
    ('jobseeker', _('Jobseeker')),
    ('employer', _('Employer')),
    ('writer', _('Writer')),
    ('admin', _('Admin')),
]

ACCOUNT_SUBSCRIPTION_TYPE_CHOICES = [
    ('free', _('Free')),
    ('standard', _('Standard')),
    ('pro', _('Pro')),
]

SOCIAL_PLATFORM_CHOICES = [
    ('facebook', _('Facebook')),
    ('twitter', _('Twitter')),
    ('linkedin', _('LinkedIn')),
    ('instagram', _('Instagram')),
    ('youtube', _('YouTube')),
    ('github', _('GitHub')),
    ('reddit', _('Reddit')),
    ('website', _('Website')),
]
