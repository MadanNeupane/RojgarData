from django.contrib import admin
from .models import EmployeeProfile, Experience, Education, Training, Skill, Language


admin.site.register(EmployeeProfile)
admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(Training)
admin.site.register(Skill)
admin.site.register(Language)