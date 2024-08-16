from django.db import models
from django.utils.translation import gettext as _
from django.conf import settings
from django.utils import timezone


class AdCampaign(models.Model):
    '''
    This model represents an ad campaign for an advertiser.
    '''
    name = models.CharField(max_length=255)
    advertiser = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='ad_campaigns', on_delete=models.SET_NULL, null=True, blank=True)
    contact = models.EmailField(blank=True, null=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    target_url = models.URLField()
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class AdCreative(models.Model):
    '''
    This model represents an ad creative for an ad campaign. It can be an image or a text ad.
    '''
    campaign = models.ForeignKey(AdCampaign, related_name='creatives', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='advertisements/ads/')
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class AdImpression(models.Model):
    creative = models.ForeignKey(AdCreative, related_name='impressions', on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()
    user_agent = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return _(f"Impression for {self.creative.title} at {self.timestamp}")


class AdClick(models.Model):
    creative = models.ForeignKey(AdCreative, related_name='clicks', on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()
    user_agent = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return _(f"Click for {self.creative.title} at {self.timestamp}")


class AdPerformanceSummary(models.Model):
    creative = models.OneToOneField(AdCreative, related_name='performance', on_delete=models.CASCADE)
    total_impressions = models.PositiveIntegerField(default=0)
    total_clicks = models.PositiveIntegerField(default=0)
    ctr = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  # Click-through rate (CTR)

    def update_performance(self):
        self.total_impressions = self.creative.impressions.count()
        self.total_clicks = self.creative.clicks.count()
        if self.total_impressions > 0:
            self.ctr = (self.total_clicks / self.total_impressions) * 100
        self.save()

    def __str__(self):
        return _(f"Performance summary for {self.creative.title}")

    class Meta:
        verbose_name = 'Ad Performance Summary'
        verbose_name_plural = 'Ad Performance Summaries'
