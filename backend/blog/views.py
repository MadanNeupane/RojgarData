from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from accounts.models import Profile
from .models import BlogPost, Tag, GuestArticleSubmission, Reaction, BlogPostBookmark
from .serializers import (
    BlogPostSerializer, TagSerializer, GuestArticleSubmissionSerializer,
    ReactionSerializer, BlogPostBookmarkSerializer
)
from .permissions import IsAuthorOrAdmin, IsAuthenticatedOrCanSubmit

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrAdmin]

    def retrieve(self, request, *args, **kwargs):
        blog_post = self.get_object()

        # Increment the visit count
        blog_post.view_count += 1
        blog_post.save(update_fields=['view_count'])

        serializer = self.get_serializer(blog_post)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def bookmark(self, request, pk=None):
        blog_post = self.get_object()
        user = request.user
        bookmark, created = BlogPostBookmark.objects.get_or_create(user=user, blog_post=blog_post)
        if not created:
            return Response({'status': 'already bookmarked'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'bookmarked'})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_bookmark(self, request, pk=None):
        blog_post = self.get_object()
        user = request.user
        try:
            bookmark = BlogPostBookmark.objects.get(user=user, blog_post=blog_post)
            bookmark.delete()
            return Response({'status': 'bookmark removed'})
        except BlogPostBookmark.DoesNotExist:
            return Response({'status': 'bookmark not found'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_bookmarks(self, request):
        user = request.user
        bookmarks = BlogPostBookmark.objects.filter(user=user)
        serializer = BlogPostBookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def react(self, request, pk=None):
        blog_post = self.get_object()
        user = request.user

        claps = request.data.get('claps', 1)  # Default to 1 if not specified
        if not 1 <= claps <= 10:
            return Response({'detail': 'Claps must be between 1 and 10.'}, status=status.HTTP_400_BAD_REQUEST)

        reaction, created = Reaction.objects.get_or_create(user=user, blog_post=blog_post)
        if not created:
            return Response({'status': 'already reacted'}, status=status.HTTP_400_BAD_REQUEST)

        # Set the number of claps
        reaction.claps = claps
        reaction.save()

        return Response({'status': 'reacted', 'claps': reaction.claps})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_reaction(self, request, pk=None):
        blog_post = self.get_object()
        user = request.user
        try:
            reaction = Reaction.objects.get(user=user, blog_post=blog_post)
            reaction.delete()
            return Response({'status': 'reaction removed'})
        except Reaction.DoesNotExist:
            return Response({'status': 'reaction not found'}, status=status.HTTP_400_BAD_REQUEST)


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrAdmin]

class GuestArticleSubmissionViewSet(viewsets.ModelViewSet):
    queryset = GuestArticleSubmission.objects.all()
    serializer_class = GuestArticleSubmissionSerializer
    permission_classes = [IsAuthenticatedOrCanSubmit]

    def perform_create(self, serializer):
        # Save the guest article submission with or without an author.
        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            serializer.save()

    # Only allow staff members to view guest article submissions.
    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.none()
