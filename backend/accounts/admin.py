from django.contrib import admin
from .models import User, Profile


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'first_name', 'last_name', 'is_staff')

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'birth_date', 'bio', 'phone_number', 'address')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
