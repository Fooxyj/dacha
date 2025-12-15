from rest_framework import serializers
from .models import Category, Product, BusinessLunch, Order, Reservation, UserAddress, BanquetMenu

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'order']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'category', 'title', 'description', 'price', 'weight', 'image', 'is_popular']

class BusinessLunchSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessLunch
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = serializers.JSONField() # Ensure items are handled as JSON if possible, or leave as TextField if that was intent. Using TextField in model but maybe JSON here is better? Let's stick to what works for now, but adding user.

    class Meta:
        model = Order
        fields = ['id', 'user', 'name', 'phone', 'address', 'items', 'total_price', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at', 'user']

class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ['id', 'address', 'is_default']

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'email']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            email=validated_data.get('email', '')
        )
        return user

class BanquetMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = BanquetMenu
        fields = '__all__'
