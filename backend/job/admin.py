from django.contrib import admin
from .models import JobPost, Skill, JobApplication


admin.site.register(JobPost)
admin.site.register(Skill)
admin.site.register(JobApplication)
