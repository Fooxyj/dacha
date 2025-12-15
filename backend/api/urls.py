from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.get_status, name='status'),
    path('menu/', views.get_menu, name='menu'),
    path('lunch/', views.get_business_lunch, name='lunch'),
    path('orders/', views.create_order, name='create_order'),
    path('paykeeper/callback/', views.paykeeper_callback, name='paykeeper_callback'),
    path('reservations/', views.create_reservation, name='create_reservation'),
    path('auth/user/', views.get_current_user, name='auth_user'),
    path('auth/register/', views.register_view, name='auth_register'),
    path('auth/login/', views.login_view, name='auth_login'),
    path('auth/logout/', views.logout_view, name='auth_logout'),
    path('profile/data/', views.get_user_profile_data, name='profile_data'),
    path('profile/address/add/', views.add_address, name='add_address'),
    path('profile/address/<int:address_id>/delete/', views.delete_address, name='delete_address'),
    path('banquet-menus/', views.get_banquet_menus, name='banquet_menus'),
    path('admin/check-new/', views.check_new_orders, name='check_new_orders'),
]
