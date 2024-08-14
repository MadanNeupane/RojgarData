from rest_framework import serializers
from .models import Contact

class ContactSerializer(serializers.ModelSerializer):
    resolved = serializers.BooleanField(read_only=True)

    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'topic', 'subject', 'message', 'resolved', 'created_at']

        view_only_fields = ['id', 'created_at', 'resolved']
