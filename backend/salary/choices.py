from django.utils.translation import gettext as _

SENIORITY_LEVELS = [
    ('intern', _('Intern')),
    ('junior', _('Junior')),
    ('mid', _('Mid')),
    ('senior', _('Senior')),
    ('lead', _('Lead')),
]

WORK_STATUS_CHOICES = [
    ('current', _('Current')),
    ('former', _('Former')),
]

WORK_TYPE_CHOICES = [
    ('full_time', _('Full Time')),
    ('part_time', _('Part Time')),
    ('contract', _('Contract')),
    ('internship', _('Internship')),
    ('freelance', _('Freelance')),
]

CURRENCY_CHOICES = [
    ('NPR', 'NPR'),
    ('USD', 'USD'),
    ('EUR', 'EUR'),
]

PAYMENT_PERIOD_CHOICES = [
    ('month', _('Month')),
    ('week', _('Week')),
    ('hour', _('Hour')),
    ('year', _('Year')),
]
