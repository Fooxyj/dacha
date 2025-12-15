from django.utils import timezone
from .models import DailyStats, DailyVisitor

class TrafficMonitorMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Ignore admin and static/media
        if not request.path.startswith('/static/') and \
           not request.path.startswith('/media/') and \
           not request.path.startswith('/admin/'):
            
            self.track_visit(request)

        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def track_visit(self, request):
        today = timezone.now().date()
        ip = self.get_client_ip(request)
        
        # Update Total Views
        stats, _ = DailyStats.objects.get_or_create(
            date=today,
            defaults={'unique_visitors': 0, 'total_views': 0}
        )
        stats.total_views += 1
        stats.save()
        
        # Update Unique Visitors (IP based)
        visitor_exists = DailyVisitor.objects.filter(date=today, ip_address=ip).exists()
        if not visitor_exists:
            DailyVisitor.objects.create(date=today, ip_address=ip)
            stats.unique_visitors += 1
            stats.save()
