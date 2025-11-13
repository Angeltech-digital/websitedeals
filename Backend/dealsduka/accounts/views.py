from rest_framework import generics, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import BlacklistMixin
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    AdminUserCreateSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .permissions import IsAdmin, IsAdminOrReadOnly
from products.models import Category
from products.serializers import CategorySerializer
from products.views import CategoryViewSet  # Import from products views instead

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            # Handle unique constraint violations
            error_message = str(e)
            if 'username' in error_message:
                return Response(
                    {'username': 'This username is already taken.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif 'email' in error_message:
                return Response(
                    {'email': 'This email is already registered.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {'detail': 'An error occurred during registration. Please try again.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'detail': 'An unexpected error occurred. Please try again.'},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    # AllowAny so clients can send a refresh token to blacklist it even if the access token
    # is already removed/expired. We'll still attempt to blacklist the provided refresh.
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Custom Token serializer/view to allow login with either username or email
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # attrs usually contains 'username' and 'password'. Allow the user to pass email
        username = attrs.get('username')
        password = attrs.get('password')

        # If the username looks like an email, try to resolve to a username
        if username and '@' in username:
            user = User.objects.filter(email=username).first()
            if user:
                attrs['username'] = user.username
            # If no user found, leave username as-is; authentication will fail below

        return super().validate(attrs)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [IsAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AdminUserCreateSerializer
        return UserSerializer

    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise ValidationError("You cannot delete your own account.")
        instance.delete()


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'
