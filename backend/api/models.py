from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название категории")
    order = models.PositiveIntegerField(default=0, verbose_name="Порядок сортировки")

    class Meta:
        verbose_name = "Категория меню"
        verbose_name_plural = "Категории меню"
        ordering = ['order']

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE, verbose_name="Категория")
    title = models.CharField(max_length=200, verbose_name="Название блюда")
    description = models.TextField(blank=True, verbose_name="Описание")
    price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="Цена")
    weight = models.CharField(max_length=50, blank=True, verbose_name="Вес/Объем")
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name="Фотография")
    is_popular = models.BooleanField(default=False, verbose_name="Популярное")

    class Meta:
        verbose_name = "Блюдо"
        verbose_name_plural = "Блюда"

    def __str__(self):
        return self.title

class BusinessLunch(models.Model):
    date = models.DateField(unique=True, verbose_name="Дата меню")
    salads = models.TextField(verbose_name="Салаты (каждый с новой строки)", help_text="Пример: Цезарь\nОвощной")
    soups = models.TextField(verbose_name="Супы (каждый с новой строки)")
    hot_dishes = models.TextField(verbose_name="Горячее (каждый с новой строки)")
    garnishes = models.TextField(verbose_name="Гарниры, Напитки, Десерт", help_text="Пишите в свободном формате")
    
    # Prices
    price_3_course = models.IntegerField(default=370, verbose_name="Цена: 3 блюда")
    price_salad_soup = models.IntegerField(default=270, verbose_name="Цена: Салат + Суп")
    price_salad_hot = models.IntegerField(default=320, verbose_name="Цена: Салат + Горячее")
    price_soup_hot = models.IntegerField(default=320, verbose_name="Цена: Суп + Горячее")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Бизнес-ланч"
        verbose_name_plural = "Бизнес-ланчи"
        ordering = ['-date']

    def __str__(self):
        return f"Ланч на {self.date}"

from django.contrib.auth.models import User

class UserAddress(models.Model):
    user = models.ForeignKey(User, related_name='addresses', on_delete=models.CASCADE, verbose_name="Пользователь")
    address = models.CharField(max_length=255, verbose_name="Адрес")
    is_default = models.BooleanField(default=False, verbose_name="Основной адрес")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Адрес доставки"
        verbose_name_plural = "Адреса доставки"

    def __str__(self):
        return f"{self.user.username}: {self.address}"

class Order(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новый'),
        ('kitchen', 'На кухне'),
        ('delivery', 'В доставке'),
        ('completed', 'Выполнен'),
        ('cancelled', 'Отменен'),
    ]

    PAYMENT_CHOICES = [
        ('cash', 'Наличные'),
        ('online', 'Оплата на сайте (PayKeeper)'),
        ('transfer', 'Карта / Перевод'),
    ]

    user = models.ForeignKey(User, related_name='orders', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Пользователь")
    name = models.CharField(max_length=100, verbose_name="Имя клиента")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    address = models.CharField(max_length=255, verbose_name="Адрес доставки")
    items = models.TextField(verbose_name="Состав заказа") # Storing as JSON string or formatted text
    total_price = models.DecimalField(max_digits=10, decimal_places=0, verbose_name="Сумма заказа")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name="Статус")
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cash', verbose_name="Способ оплаты")
    is_paid = models.BooleanField(default=False, verbose_name="Оплачено")
    payment_id = models.CharField(max_length=100, blank=True, null=True, verbose_name="ID платежа")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ['-created_at']

    def __str__(self):
        return f"Заказ #{self.id} от {self.name} ({self.total_price} ₽)"

class Reservation(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя")
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    date = models.DateField(verbose_name="Дата")
    time = models.TimeField(verbose_name="Время")
    guests = models.IntegerField(verbose_name="Количество гостей")
    comment = models.TextField(blank=True, verbose_name="Комментарий")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")

    class Meta:
        verbose_name = "Бронь столика"
        verbose_name_plural = "Брони столов"
        ordering = ['-date', '-time']

    def __str__(self):
        return f"Бронь: {self.name} на {self.date} {self.time}"

class BanquetMenu(models.Model):
    LAYOUT_CHOICES = [
        ('image', 'Только изображение'),
        ('list', 'Интерактивный список'),
    ]

    CATEGORY_CHOICES = [
        ('adult', 'Основное меню'),
        ('children', 'Детское меню'),
    ]

    title = models.CharField(max_length=100, verbose_name="Название меню (например, 'Стандарт')")
    description = models.TextField(verbose_name="Краткое описание", blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='adult', verbose_name="Категория меню")
    price_per_person = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True, verbose_name="Цена за человека")
    cover_image = models.ImageField(upload_to='banquet_covers/', verbose_name="Обложка карточки")
    
    layout_type = models.CharField(max_length=10, choices=LAYOUT_CHOICES, default='list', verbose_name="Тип отображения")
    
    # For 'image' layout
    content_image = models.ImageField(upload_to='banquet_menus/', null=True, blank=True, verbose_name="Изображение меню (если тип 'Только изображение')")
    
    # For 'list' layout
    # Structure: [{"category": "Salads", "items": ["Caesar", "Greek"]}, ...]
    items_json = models.TextField(default="[]", verbose_name="Список блюд (JSON)", help_text='Например: [{"category": "Салаты", "items": ["Оливье", "Цезарь"]}]')
    
    is_active = models.BooleanField(default=True, verbose_name="Активно")
    order = models.IntegerField(default=0, verbose_name="Порядок сортировки")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Банкетное меню"
        verbose_name_plural = "Банкетные меню"
        ordering = ['order']

class DailyStats(models.Model):
    date = models.DateField(unique=True, verbose_name="Дата")
    unique_visitors = models.IntegerField(default=0, verbose_name="Посетители (уник.)")
    total_views = models.IntegerField(default=0, verbose_name="Просмотры страниц")
    
    class Meta:
        verbose_name = "Статистика посещений"
        verbose_name_plural = "Статистика посещений"
        ordering = ['-date']

    def __str__(self):
        return f"Статистика за {self.date}"

class DailyVisitor(models.Model):
    ip_address = models.GenericIPAddressField(verbose_name="IP адрес")
    date = models.DateField(auto_now_add=True, verbose_name="Дата")
    
    class Meta:
        verbose_name = "Посетитель"
        verbose_name_plural = "Посетители"
        unique_together = ('ip_address', 'date')
