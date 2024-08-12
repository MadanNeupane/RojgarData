from django.contrib import admin
from .models import JobseekerProfile, Experience, Education, Training, Skill, Language


admin.site.register(JobseekerProfile)
admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(Training)
admin.site.register(Skill)
admin.site.register(Language)