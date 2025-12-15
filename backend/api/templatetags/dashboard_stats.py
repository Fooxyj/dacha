from django import template
from django.db.models import Sum
from django.utils import timezone
from api.models import DailyStats, Order, Reservation

register = template.Library()

@register.inclusion_tag('admin/dashboard_stats.html')
def dashboard_stats():
    today = timezone.now().date()
    
    # Traffic
    try:
        stats = DailyStats.objects.get(date=today)
        unique_visitors = stats.unique_visitors
        total_views = stats.total_views
    except DailyStats.DoesNotExist:
        unique_visitors = 0
        total_views = 0
        
    # Revenue (Today) - Including NEW orders so user sees immediate results
    orders_today = Order.objects.filter(
        created_at__date=today
    ).exclude(status='cancelled')
    
    revenue_today = orders_today.aggregate(Sum('total_price'))['total_price__sum'] or 0
    orders_count_today = orders_today.count()
    
    # New Orders Count (Actionable)
    new_orders_count = orders_today.filter(status='new').count()

    # Revenue (Total)
    orders_total = Order.objects.exclude(status='cancelled')
    revenue_total = orders_total.aggregate(Sum('total_price'))['total_price__sum'] or 0
    
    # Reservations (Today)
    reservations_today = Reservation.objects.filter(date=today).count()
    
    # Upcoming Reservations (for the dashboard table)
    upcoming_reservations = Reservation.objects.filter(
        date__gte=today
    ).order_by('date', 'time')[:10] # Show next 10 reservations
    
    # Latest New Orders (Actionable items)
    latest_new_orders = Order.objects.filter(
        status='new'
    ).order_by('-created_at')[:10]

    return {
        'unique_visitors': unique_visitors,
        'total_views': total_views,
        'revenue_today': revenue_today,
        'orders_count_today': orders_count_today,
        'new_orders_count': new_orders_count,
        'revenue_total': revenue_total,
        'reservations_today': reservations_today,
        'upcoming_reservations': upcoming_reservations,
        'latest_new_orders': latest_new_orders,
    }
