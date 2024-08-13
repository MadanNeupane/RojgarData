from django.db import models
from accounts.models import Profile
from . import choices


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    points_required = models.IntegerField()
    reward = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='badges/icons/')

    def __str__(self):
        return self.name

class ScoreLog(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='score_logs')
    action = models.CharField(max_length=100, choices=choices.ACTION_CHOICES)
    points = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.user.username} - {self.action} - {self.points} points"

class ProfileAchievement(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    achieved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.user.username} - {self.achievement.name}"

class ProfileBadge(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.user.username} - {self.badge.name}"
