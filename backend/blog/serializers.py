from rest_framework import serializers
from .models import BlogPost, Tag, GuestArticleSubmission, Reaction, BlogPostBookmark
from accounts.models import Profile

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class BlogPostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    author_name = serializers.SerializerMethodField()
    total_claps = serializers.IntegerField(read_only=True)
    total_bookmarks = serializers.IntegerField(read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'author', 'author_name', 'title', 'content', 'category', 'tags', 'associated_company', 'view_count', 'total_claps', 'total_bookmarks', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'view_count', 'total_claps', 'total_bookmarks', 'created_at', 'updated_at']

    def get_author_name(self, obj):
        return obj.author.username if obj.author else obj.author_name

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ['id', 'blog_post', 'user', 'claps']
        read_only_fields = ['id', 'user']

    def validate_claps(self, value):
        if value < 1 or value > 10:
            raise serializers.ValidationError("Claps must be between 1 and 10.")
        return value

class GuestArticleSubmissionSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = GuestArticleSubmission
        fields = ['id', 'author', 'author_name', 'email', 'title', 'content', 'category', 'tags', 'associated_company', 'approved', 'created_at']
        read_only_fields = ['id', 'author', 'approved', 'created_at']

class BlogPostBookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostBookmark
        fields = ['id', 'blog_post', 'user', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
