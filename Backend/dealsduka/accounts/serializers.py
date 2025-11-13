from rest_framework import serializers
from django.contrib.auth import get_user_model
from products.models import Category

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'created_at')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'is_staff', 'is_superuser', 'phone_number', 'address', 'bio', 'profile_picture')
        read_only_fields = ('role', 'is_staff', 'is_superuser')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password_confirm', 'phone_number', 'address')

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # Check for duplicate username
        username = data.get('username')
        email = data.get('email')
        
        if not username:
            # Use email as username if not provided
            username = email
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "This username is already taken."})
        
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "This email is already registered."})
        
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        username = validated_data.get('username')
        email = validated_data.get('email')
        if not username:
            # Use email as username if not provided
            username = email
        # Always create as regular user (CUSTOMER), never as admin
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data.get('password'),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            role='CUSTOMER'  # Force role to be CUSTOMER only
        )
        return user


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'phone_number', 'address', 'bio')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            password=validated_data.get('password'),
            role=validated_data.get('role'),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            bio=validated_data.get('bio', '')
        )
        return user
