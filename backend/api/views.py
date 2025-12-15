from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Category, Product, BusinessLunch, Order, Reservation, UserAddress, BanquetMenu
from .serializers import CategorySerializer, ProductSerializer, BusinessLunchSerializer, OrderSerializer, ReservationSerializer, UserSerializer, RegisterSerializer, UserAddressSerializer, BanquetMenuSerializer
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
def get_current_user(request):
    if request.user.is_authenticated:
        return Response(UserSerializer(request.user).data)
    # Return 401 so frontend knows to set user to null
    return Response({"detail": "Not authenticated"}, status=401)

@csrf_exempt
@api_view(['POST'])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        login(request, user)
        return Response(UserSerializer(user).data)
    return Response(serializer.errors, status=400)

@csrf_exempt
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response(UserSerializer(user).data)
    return Response({"error": "Invalid credentials"}, status=400)

@csrf_exempt
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({"status": "logged out"})

@api_view(['GET'])
def get_status(request):
    return Response({"status": "running", "message": "Django backend is ready!"})

@api_view(['GET'])
def get_menu(request):
    categories = Category.objects.all()
    products = Product.objects.all()
    
    return Response({
        "categories": CategorySerializer(categories, many=True).data,
        "products": ProductSerializer(products, many=True).data
    })

@api_view(['GET'])
def get_business_lunch(request):
    import datetime
    today = datetime.date.today()
    
    # Logic: 
    # 1. Try to get exactly today's lunch
    # 2. If not found, get the LATEST created lunch (order by date desc) appropriately
    
    lunch = BusinessLunch.objects.filter(date=today).first()
    
    if not lunch:
        # Fallback to the most recent lunch available in the database
        lunch = BusinessLunch.objects.order_by('-date').first()
    
    if lunch:
        data = BusinessLunchSerializer(lunch).data
        # Add debug info for the user
        data['debug_server_date'] = str(today)
        return Response(data)
        
    return Response(None)

from .paykeeper import get_payment_url

@csrf_exempt
@api_view(['POST'])
def create_order(request):
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()
        if request.user.is_authenticated:
            order.user = request.user
            order.save()
            
        response_data = {"status": "success", "order_id": order.id}
        
        # Handle PayKeeper payment
        if order.payment_method == 'online':
            try:
                payment_url = get_payment_url(
                    order_id=order.id,
                    amount=order.total_price,
                    client_name=order.name,
                    client_phone=order.phone
                )
                response_data["payment_url"] = payment_url
            except Exception as e:
                # Log error but don't fail the order creation
                print(f"Error generating PayKeeper URL: {e}")
                
        return Response(response_data, status=201)
    return Response(serializer.errors, status=400)

@csrf_exempt
@api_view(['POST'])
def paykeeper_callback(request):
    """
    Handle PayKeeper notification.
    ContentType: application/x-www-form-urlencoded
    """
    from .paykeeper import verify_signature
    import hashlib
    
    # Data comes as form data
    payment_id = request.data.get('id')
    order_id = request.data.get('orderid')
    key = request.data.get('key')
    # service_name = request.data.get('service_name')
    # clientid = request.data.get('clientid')
    # sum = request.data.get('sum')

    if not payment_id or not key or not order_id:
        return Response("Error: Missing data", status=400)

    # Verify signature
    if verify_signature(payment_id, key):
        try:
            order = Order.objects.get(id=order_id)
            
            # Check if already paid to avoid duplicates logic if needed
            if not order.is_paid:
                order.is_paid = True
                order.payment_id = payment_id
                order.payment_method = 'online'
                order.save()
                
            # Return OK message required by PayKeeper
            # Usually strict: OK <md5(id+secret)>
            response_hash = hashlib.md5((payment_id + settings.PAYKEEPER_SECRET_KEY).encode('utf-8')).hexdigest()
            content = f"OK {response_hash}"
            return Response(content, status=200)
            
        except Order.DoesNotExist:
            return Response("Error: Order not found", status=404)
        except Exception as e:
            print(f"Payment processing error: {e}")
            return Response(f"Error: {e}", status=500)
    
    return Response("Error: Hash mismatch", status=403)

@csrf_exempt
@api_view(['POST'])
def create_reservation(request):
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        # Optional: Link reservation to user if needed
        serializer.save()
        return Response({"status": "success", "reservation_id": serializer.data['id']}, status=201)
    return Response(serializer.errors, status=400)

# Profile & Address APIs

@api_view(['GET'])
def get_user_profile_data(request):
    if not request.user.is_authenticated:
        return Response({"error": "Unauthorized"}, status=401)
    
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')
    addresses = UserAddress.objects.filter(user=user)
    
    return Response({
        "user": UserSerializer(user).data,
        "orders": OrderSerializer(orders, many=True).data,
        "addresses": UserAddressSerializer(addresses, many=True).data
    })

@csrf_exempt
@api_view(['POST'])
def add_address(request):
    if not request.user.is_authenticated:
        return Response({"error": "Unauthorized"}, status=401)
    
    address_str = request.data.get('address')
    if not address_str:
        return Response({"error": "Address is required"}, status=400)
    
    # If this is the first address, make it default
    is_first = not UserAddress.objects.filter(user=request.user).exists()
    
    address = UserAddress.objects.create(
        user=request.user,
        address=address_str,
        is_default=is_first
    )
    return Response(UserAddressSerializer(address).data)

@csrf_exempt
@api_view(['DELETE'])
def delete_address(request, address_id):
    if not request.user.is_authenticated:
        return Response({"error": "Unauthorized"}, status=401)
    
    try:
        address = UserAddress.objects.get(id=address_id, user=request.user)
        address.delete()
        return Response({"status": "deleted"})
    except UserAddress.DoesNotExist:
        return Response({"error": "Address not found"}, status=404)

@api_view(['GET'])
def get_banquet_menus(request):
    menus = BanquetMenu.objects.filter(is_active=True)
    return Response(BanquetMenuSerializer(menus, many=True).data)

@api_view(['GET'])
def check_new_orders(request):
    # This endpoint is polled by the admin panel to play sound
    # We can check for orders created in the last minute, or just return total count of 'new' orders
    # returning total 'new' is better for "badged" notifications, but for sound we might want "recent".
    # Let's return both for flexibility.
    
    from datetime import timedelta
    from django.utils import timezone
    
    threshold = timezone.now() - timedelta(seconds=30)
    
    # Recent new orders (for sound)
    recent_orders = Order.objects.filter(created_at__gt=threshold).count()
    recent_reservations = Reservation.objects.filter(created_at__gt=threshold).count()
    
    # Total pending (for badges)
    pending_orders = Order.objects.filter(status='new').count()
    
    return Response({
        "recent_orders": recent_orders,
        "recent_reservations": recent_reservations,
        "pending_orders": pending_orders,
        "play_sound": (recent_orders > 0 or recent_reservations > 0)
    })


def home_view(request):
    """Main page view"""
    return HttpResponse("Welcome to Dacha API Backend!")
