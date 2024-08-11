from django.conf import settings
from django.db import models
from django.utils.translation import gettext as _
from company.models import Company
from . import choices


class BlogPost(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='blog_posts', on_delete=models.SET_NULL, null=True)
    author_name = models.CharField(max_length=255, blank=True, null=True)  # Optional if author is provided
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=255, choices=choices.BLOG_CATEGORY_CHOICES)
    tags = models.ManyToManyField('Tag', blank=True, related_name='blog_posts')
    associated_company = models.ForeignKey(Company, related_name='blog_posts', on_delete=models.SET_NULL, null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def total_claps(self):
        return sum(reaction.claps for reaction in self.reactions.all())

    def total_bookmarks(self):
        return self.bookmarks.count()


class BlogPostBookmark(models.Model):
    """
    Stores bookmarks for each blog post by users.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='bookmarked_posts', on_delete=models.CASCADE)
    blog_post = models.ForeignKey(BlogPost, related_name='bookmarks', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'blog_post')  # Ensure a user can bookmark a blog post only once

    def __str__(self):
        return _(f"{self.user.username} bookmarked {self.blog_post.title}")


class Tag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class GuestArticleSubmission(models.Model):
    """
    Stores guest article submissions from users.
    """

    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='guest_articles', on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=255)
    email = models.EmailField()
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=255, choices=choices.BLOG_CATEGORY_CHOICES)
    tags = models.ManyToManyField('Tag', blank=True, related_name='guest_articles')
    associated_company = models.ForeignKey(Company, related_name='guest_articles', on_delete=models.SET_NULL, null=True, blank=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return _(f"Guest Article Submission: {self.title} by {self.author_name}")

    def save(self, *args, **kwargs):
        """
        Override the save method to automatically create a BlogPost if the guest article is approved.
        """
        if self.approved:
            # Check if a BlogPost already exists for this submission
            if not BlogPost.objects.filter(title=self.title, author=self.author).exists():
                # Create a new BlogPost from the guest submission
                blog_post = BlogPost.objects.create(
                    author=self.author,
                    author_name=self.author_name,
                    title=self.title,
                    content=self.content,
                    category=self.category,
                    associated_company=self.associated_company
                )
                # Add tags to the new BlogPost
                blog_post.tags.set(self.tags.all())

        super().save(*args, **kwargs)


class Reaction(models.Model):
    """
    Stores reactions (claps) for each blog post.
    """

    blog_post = models.ForeignKey(BlogPost, related_name='reactions', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reactions', on_delete=models.CASCADE)
    claps = models.PositiveIntegerField(default=1)  # Number of claps a user can give, starting from 1

    class Meta:
        unique_together = ('blog_post', 'user')  # Ensure a user can react to a blog post only once

    def __str__(self):
        return _(f"{self.claps} claps by {self.user.username} on {self.blog_post.title}")

    def save(self, *args, **kwargs):
        """
        Ensure the number of claps does not exceed 10.
        """
        if self.claps > 10:
            self.claps = 10
        super().save(*args, **kwargs)
