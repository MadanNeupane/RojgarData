from django.contrib import admin
from .models import JobPost, Skill, JobApplication, JobBookmark


admin.site.register(JobPost)
admin.site.register(Skill)
admin.site.register(JobApplication)
admin.site.register(JobBookmark)
