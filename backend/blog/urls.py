from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, TagViewSet, GuestArticleSubmissionViewSet, ReactionViewSet

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='blog-post')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'guest-articles', GuestArticleSubmissionViewSet, basename='guest-article')
router.register(r'reactions', ReactionViewSet, basename='reaction')

urlpatterns = router.urls
