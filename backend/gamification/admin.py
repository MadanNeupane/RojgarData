from django.contrib import admin
from .models import Achievement, Badge, ScoreLog, ProfileAchievement, ProfileBadge

admin.site.register(Achievement)
admin.site.register(Badge)
admin.site.register(ScoreLog)
admin.site.register(ProfileAchievement)
admin.site.register(ProfileBadge)
