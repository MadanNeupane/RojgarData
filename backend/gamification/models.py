from django.db import models
from accounts.models import Profile
from . import choices


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    points_required = models.IntegerField()
    related_action = models.CharField(max_length=100, choices=choices.ACTION_CHOICES)
    icon = models.ImageField(upload_to='achievements/icons/')

    def __str__(self):
        return self.name


class ScoreLog(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='score_logs')
    action = models.CharField(max_length=100, choices=choices.ACTION_CHOICES)
    points = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.user.username} - {self.action} - {self.points} points"

    def save(self, *args, **kwargs):
        # Call the original save() method
        super().save(*args, **kwargs)

        # Check for achievement unlocking
        self.check_for_achievements()

    def check_for_achievements(self):
        # Calculate the total points for each related action
        total_points = (
            ScoreLog.objects.filter(profile=self.profile, action=self.action)
            .aggregate(models.Sum("points"))["points__sum"]
        )

        # Get achievements related to this action and total points
        achievements = Achievement.objects.filter(
            related_action=self.action, points_required__lte=total_points
        )

        # Award achievements if not already awarded
        for achievement in achievements:
            if not ProfileAchievement.objects.filter(
                profile=self.profile, achievement=achievement
            ).exists():
                ProfileAchievement.objects.create(
                    profile=self.profile, achievement=achievement
                )


class ProfileAchievement(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    achieved_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.user.username} - {self.achievement.name}"
