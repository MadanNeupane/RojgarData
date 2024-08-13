from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from gamification.serializers import ProfileAchievementSerializer
from .models import Profile, SocialLink, User, VerificationRequest

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'subscription_type', 'has_contributed']

    def update(self, instance, validated_data):
        # Regular users cannot update these fields
        if not self.context['request'].user.is_staff:
            validated_data.pop('role', None)
            validated_data.pop('subscription_type', None)
            validated_data.pop('has_contributed', None)

        return super().update(instance, validated_data)

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'role']

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['platform', 'url', 'profile']
        extra_kwargs = {
            'profile': {'read_only': True}  # Profile is determined by the authenticated user
        }

    def validate(self, data):
        platform = data.get('platform')
        url = data.get('url')

        # Custom validation for URLs based on platform
        url_patterns = {
            'facebook': 'facebook.com/',
            'twitter': ('twitter.com/', 'x.com/'),
            'linkedin': 'linkedin.com/',
            'instagram': 'instagram.com/',
            'youtube': 'youtube.com/',
            'github': 'github.com/',
            'reddit': 'reddit.com/',
            'website': '',
        }

        expected_pattern = url_patterns.get(platform)
        if expected_pattern:
            if isinstance(expected_pattern, tuple):
                if not any(pattern in url for pattern in expected_pattern):
                    raise serializers.ValidationError(
                        {'url': f"URL for {platform} must contain one of the following: {', '.join(expected_pattern)}"}
                    )
            else:
                if expected_pattern and expected_pattern not in url:
                    raise serializers.ValidationError(
                        {'url': f"URL for {platform} must contain '{expected_pattern}'"}
                    )

        return data

class ProfileSerializer(serializers.ModelSerializer):
    social_links = SocialLinkSerializer(many=True, required=False)
    username = serializers.CharField(source='user.username')
    full_name = serializers.CharField(source='user.get_full_name')
    achievements = ProfileAchievementSerializer(many=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'username', 'full_name', 'profile_picture', 'birth_date', 'phone_number', 'address', 'bio',
            'reputation_points', 'achievements', 'social_links', 'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'username', 'full_name', 'reputation_points', 'achievements', 'is_verified', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        social_links_data = validated_data.pop('social_links', [])

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update or create social links
        for social_link_data in social_links_data:
            platform = social_link_data.get('platform')
            url = social_link_data.get('url')
            social_link, created = SocialLink.objects.update_or_create(
                profile=instance,
                platform=platform,
                defaults={'url': url}
            )

        return instance

    def validate(self, data):
        user_data = data.get('user', {})
        if not self.context['request'].user.is_staff:
            # Regular users cannot update these fields
            for field in ['role', 'subscription_type', 'has_contributed']:
                if field in user_data:
                    raise serializers.ValidationError({field: "This field cannot be updated by non-admin users."})
        return data
