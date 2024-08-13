from django.db import transaction
from django.db.models import F
from accounts.models import Profile
from .models import ScoreLog, Achievement, Badge

ACTION_POINTS = {
    '''
    Points awarded based on actions performed.
    '''

    'account_registration': 10,
    'email_verification': 5,
    'profile_completion': 20,
    'follow_company': 2,
    'review_company': 10,
    'suggest_company_update': 5,
    'company_update_approved': 15,
    'ask_question': 5,
    'answer_question': 10,
    'upvote_received': 2,
    'post_job': 15,
    'apply_for_job': 5,
    'bookmark_job': 1,
    'submit_salary': 10,
    'salary_verified': 20,
    'report_salary': 5,
    'create_blogpost': 15,
    'react_blogpost': 1,
    'submit_guest_article': 20,
    'guest_article_approved': 30,
    'reaction_received': 1,
    'donate_money': None,  # Handled separately
    'total_score': None,  # Handled separately
}


def award_achievement(user, achievement):
    """
    Award an achievement to a user and give them a badge if applicable.

    :param user: The user to award the achievement to.
    :param achievement: The Achievement instance to award.
    """
    profile = Profile.objects.get(user=user)

    # Award the badge associated with this achievement
    if achievement.reward:
        badge, created = Badge.objects.get_or_create(name=achievement.reward)
        profile.badges.add(badge)

    # Optionally, we can send a notification about the achievement
    # send_notification(user, f"You have unlocked the '{achievement.name}' achievement!")
    print(f"Awarded achievement: {achievement.name}")


def apply_reputation_points(user, action, amount=None):
    """
    Apply reputation points for a user's action and award achievements if criteria are met.

    :param user: The user earning points.
    :param action: The action performed (string).
    :param amount: Amount for actions like 'donate_money'.
    """

    try:
        with transaction.atomic():
            profile, created = Profile.objects.get_or_create(user=user)

            if action == 'donate_money':
                points = amount
            else:
                points = ACTION_POINTS.get(action, 0)

            Profile.objects.filter(user=user).update(reputation_points=F('reputation_points') + points)

            ScoreLog.objects.create(user=user, action=action, points=points)

            message = f"You have earned {points} reputation points for {action.replace('_', ' ')}."
            # send_notification(user, message)
            print(f'{message}')

            profile.refresh_from_db()

            # Check if the user qualifies for any new achievements
            for achievement in Achievement.objects.all():
                if profile.reputation_points >= achievement.points_required:
                    award_achievement(user, achievement)

            return profile.reputation_points
    except Exception as e:
        print(f"Error updating reputation points: {e}")
        return None
