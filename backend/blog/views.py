from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogPost, Tag, GuestArticleSubmission, Reaction, Comment, BlogPostBookmark
from .serializers import (
    BlogPostSerializer, TagSerializer, GuestArticleSubmissionSerializer,
    ReactionSerializer, CommentSerializer, BlogPostBookmarkSerializer
)
from .permissions import IsAuthorOrAdmin, IsAuthenticatedOrCanSubmit
from .filters import BlogPostFilter, GuestArticleSubmissionFilter

class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrAdmin]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BlogPostFilter
    search_fields = ['title', 'content', 'author__username', 'author_name']
    ordering_fields = ['created_at', 'view_count']
    ordering = ['-created_at']

    def retrieve(self, request, *args, **kwargs):
        blog_post = self.get_object()
        # Increment the view count
        blog_post.view_count += 1
        blog_post.save(update_fields=['view_count'])

        serializer = self.get_serializer(blog_post)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny], url_path='comments')
    def list_comments(self, request, pk=None):
        blog_post = self.get_object()
        comments = blog_post.comments.filter(parent=None)  # Fetch only top-level comments
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='comments')
    def create_comment(self, request, pk=None):
        blog_post = self.get_object()
        serializer = CommentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user, blog_post=blog_post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='comments/(?P<comment_pk>[^/.]+)/reply')
    def reply_to_comment(self, request, pk=None, comment_pk=None):
        blog_post = self.get_object()
        parent_comment = Comment.objects.get(pk=comment_pk, blog_post=blog_post)
        serializer = CommentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user, parent=parent_comment, blog_post=blog_post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch', 'delete'], permission_classes=[IsAuthenticated, IsAuthorOrAdmin], url_path='comments/(?P<comment_pk>[^/.]+)')
    def update_or_delete_comment(self, request, pk=None, comment_pk=None):
        blog_post = self.get_object()
        comment = Comment.objects.get(pk=comment_pk, blog_post=blog_post)

        if request.method == 'PATCH':
            # Update comment
            serializer = CommentSerializer(comment, data=request.data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        if request.method == 'DELETE':
            # Delete comment
            comment.delete()
            return Response({'status': 'comment deleted'}, status=status.HTTP_204_NO_CONTENT)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrAdmin]

class GuestArticleSubmissionViewSet(viewsets.ModelViewSet):
    queryset = GuestArticleSubmission.objects.all()
    serializer_class = GuestArticleSubmissionSerializer
    permission_classes = [IsAuthenticatedOrCanSubmit]
    filter_backends = [DjangoFilterBackend]
    filterset_class = GuestArticleSubmissionFilter

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
