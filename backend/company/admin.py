from django.contrib import admin
from .models import Company, SocialLink, CompanyReview, ReviewAspectScore, CompanyUpdateSuggestion, ReviewSpamReport, \
    CompanyQuestion, CompanyAnswer


admin.site.register(Company)
admin.site.register(SocialLink)
admin.site.register(CompanyReview)
admin.site.register(ReviewAspectScore)
admin.site.register(CompanyUpdateSuggestion)
admin.site.register(ReviewSpamReport)
admin.site.register(CompanyQuestion)
admin.site.register(CompanyAnswer)
