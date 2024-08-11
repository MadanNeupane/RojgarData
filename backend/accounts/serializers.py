from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from .models import Profile, SocialLink, User

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'subscription_type', 'has_contributed']

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
                        { 'url': f"URL for {platform} must contain one of the following: {', '.join(expected_pattern)}" }
                    )
            else:
                if expected_pattern and expected_pattern not in url:
                    raise serializers.ValidationError(
                        { 'url': f"URL for {platform} must contain '{expected_pattern}'" }
                    )

        return data

class ProfileSerializer(serializers.ModelSerializer):
    social_links = SocialLinkSerializer(many=True, required=False)

    class Meta:
        model = Profile
        fields = ['id', 'profile_picture', 'birth_date', 'phone_number', 'address', 'bio', 'reputation_points', 'social_links']
        read_only_fields = ['reputation_points']

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
