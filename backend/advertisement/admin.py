from django.contrib import admin
from .models import AdCampaign, AdCreative, AdImpression, AdClick, AdPerformanceSummary

admin.site.register(AdCampaign)
admin.site.register(AdCreative)
admin.site.register(AdImpression)
admin.site.register(AdClick)
admin.site.register(AdPerformanceSummary)
