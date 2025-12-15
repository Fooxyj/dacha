from django.contrib import admin
from .models import Category, Product, BusinessLunch, Order, Reservation

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    list_editable = ('order',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'is_popular')
    list_filter = ('category', 'is_popular')
    search_fields = ('title', 'description')

@admin.register(BusinessLunch)
class BusinessLunchAdmin(admin.ModelAdmin):
    list_display = ('date', 'created_at')
    ordering = ('-date',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'total_price', 'status', 'formatted_items', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'phone', 'address')
    readonly_fields = ('created_at', 'formatted_items')
    actions = ['set_kitchen', 'set_delivery', 'set_completed']

    def formatted_items(self, obj):
        import json
        from django.utils.html import format_html
        try:
            items = json.loads(obj.items)
            html = "<ul style='margin: 0; padding-left: 15px;'>"
            for item in items:
                html += f"<li><b>{item.get('title')}</b> x{item.get('quantity')} — {item.get('price')} ₽</li>"
            html += "</ul>"
            return format_html(html)
        except:
            return "Ошибка отображения"
    
    formatted_items.short_description = "Состав заказа"

    @admin.action(description="На кухню")
    def set_kitchen(self, request, queryset):
        queryset.update(status='kitchen')

    @admin.action(description="В доставку")
    def set_delivery(self, request, queryset):
        queryset.update(status='delivery')

    @admin.action(description="Выполнен")
    def set_completed(self, request, queryset):
        queryset.update(status='completed')

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'date', 'time', 'guests', 'created_at')
    list_filter = ('date', 'created_at')
    search_fields = ('name', 'phone')

from .models import BanquetMenu

@admin.register(BanquetMenu)
class BanquetMenuAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'layout_type', 'is_active', 'order')
    list_filter = ('category', 'is_active', 'layout_type')
    list_editable = ('order', 'is_active', 'category')
    search_fields = ('title', 'description')
