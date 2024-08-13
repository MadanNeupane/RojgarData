from django.contrib import admin
from .models import Achievement, ScoreLog, ProfileAchievement

admin.site.register(Achievement)
admin.site.register(ScoreLog)
admin.site.register(ProfileAchievement)
