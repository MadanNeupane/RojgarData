from django.contrib import admin
from .models import User, Profile, SocialLink, VerificationRequest, Notification


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'first_name', 'last_name', 'is_staff')

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'birth_date', 'bio', 'phone_number', 'address')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')

class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('id', 'profile__user', 'platform', 'url')
    search_fields = ('profile__user__username', 'profile__user__first_name', 'profile__user__last_name')


admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(SocialLink, SocialLinkAdmin)
admin.site.register(VerificationRequest)
admin.site.register(Notification)

