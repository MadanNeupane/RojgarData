from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from debug_toolbar.toolbar import debug_toolbar_urls

admin.site.site_header = "Rojgar Data Admin"
admin.site.site_title = "Rojgar Data Admin Portal"
admin.site.index_title = "Welcome to Rojgar Data Admin Portal"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('djoser.urls')),
    path('accounts/', include('djoser.urls.jwt')),
    path('employee/', include('employee.urls')),
    path('company/', include('company.urls')),
    path('salary/', include('salary.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += debug_toolbar_urls()

