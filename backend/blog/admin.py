from django.contrib import admin
from .models import BlogPost, Tag, GuestArticleSubmission, Reaction, Comment, BlogPostBookmark


admin.site.register(BlogPost)
admin.site.register(Tag)
admin.site.register(GuestArticleSubmission)
admin.site.register(Reaction)
admin.site.register(Comment)
admin.site.register(BlogPostBookmark)
