from rest_framework import serializers
from .models import News, Advertisement
from django.contrib.auth.models import User


class NewsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    author_image_url = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = [
            'id', 'title', 'description', 'content', 'category',
            'image', 'image_url', 'author_name', 'author_image',
            'author_image_url', 'time', 'place', 'publication_date'
        ]
        read_only_fields = ['id', 'publication_date']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_author_image_url(self, obj):
        request = self.context.get('request')
        if obj.author_image and request:
            return request.build_absolute_uri(obj.author_image.url)
        return None


class AdvertisementSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Advertisement
        fields = [
            'id', 'title', 'description', 'content',
            'image', 'image_url', 'publication_date'
        ]
        read_only_fields = ['id', 'publication_date']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'username']
