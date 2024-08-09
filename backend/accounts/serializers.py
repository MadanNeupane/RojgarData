from rest_framework import serializers
from djoser.serializers import UserSerializer as BaseUserSerializer, \
    UserCreateSerializer as BaseUserCreateSerializer
from .models import Profile, SocialLink


class UserSerializer(BaseUserSerializer):

    class Meta(BaseUserSerializer.Meta):
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'subscription_type', 'has_contributed']


class UserCreateSerializer(BaseUserCreateSerializer):

    class Meta(BaseUserCreateSerializer.Meta):
        fields = ['id', 'username', 'email', 'password', 'first_name',  'last_name', 'birth_date', 'role', 'subscription_type']


class SocialLinkSerializer(serializers.ModelSerializer):

    class Meta:
        model = SocialLink
        fields = ['platform', 'url']

    def create(self, validated_data):
        return SocialLink.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.url = validated_data.get('url', instance.url)
        instance.save()
        return instance

    def validate(self, data):
        if 'url' not in data:
            raise serializers.ValidationError("url is required")
        return data


class ProfileSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(read_only=True)
    social_links = SocialLinkSerializer(many=True, required=False)
    reputation_points = serializers.IntegerField(read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'profile_picture', 'birth_date', 'phone_number', 'address', 'bio', 'reputation_points', 'social_links']
