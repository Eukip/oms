from django.db import models
from django.contrib.auth.models import AbstractUser
from django_fsm import FSMIntegerField, transition
from .utils import (STATUSES,
                    ROLES,
                    NEW,
                    PROCESSING,
                    REJECTED,
                    CONFIRMED,
                    RETURNED,
                    SEND,
                    PRINTED,
                    DELIVERY_ACCEPTED,
                    DELIVERY_REJECTED,
                    DELIVERY_RETURNED,
                    DELIVERY_DONE,
                    ADMIN,
                    SMARTPOST_API_URL,
                    logger
                    )


class User(AbstractUser):
    username = models.CharField(max_length=128, unique=True)
    role = models.IntegerField(choices=ROLES, default=ADMIN)
    branch = models.ForeignKey('Branch', null=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'user'
        verbose_name = 'Сотрудник'
        verbose_name_plural = 'Сотрудники'

    def __str__(self):
        return f'{self.username} ({self.first_name + self.last_name})'


class Order(models.Model):
    # Personal details
    firstname = models.CharField(max_length=64, verbose_name='Имя')
    lastname = models.CharField(max_length=64, verbose_name='Фамилия')
    middlename = models.CharField(max_length=64, default='', verbose_name='Отечество')
    fullname = models.CharField(max_length=128, verbose_name='Фамилия и имя латиницей')
    phone = models.CharField(max_length=20, verbose_name='Телефон')
    phone2 = models.CharField(max_length=20, verbose_name='Телефон', null=True, blank=True)
    phone3 = models.CharField(max_length=20, verbose_name='Телефон', null=True, blank=True)
    email = models.CharField(max_length=100, verbose_name='Электронная почта')
    birthdate = models.DateField('Дата рождения')

    # Passport data details
    image_front = models.ImageField(upload_to='images', verbose_name='Фото лицевой стороны паспорта')
    image_back = models.ImageField(upload_to='images', verbose_name='Фото тыльной стороны паспорта')
    citizenship = models.CharField(max_length=100, verbose_name='Гражданство')
    serial_number = models.CharField(max_length=50, verbose_name='Серия и номер паспорта')
    inn = models.CharField(max_length=50, verbose_name='ИНН')

    # Addresses
    workplace = models.CharField(max_length=100, verbose_name='Место работы')
    formal_address = models.TextField(verbose_name='Адрес по прописке')
    address = models.TextField(verbose_name='Адрес фактического проживания')
    city = models.CharField('Город доставки', max_length=100)
    source = models.CharField(max_length=100, default='')

    # ------
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата обновления')
    status = FSMIntegerField('Статус', choices=STATUSES, default=NEW)
    return_reason = models.TextField('Причина возврата', default='')
    cancel_reason = models.TextField('Причина отмены', default='')

    class Meta:
        db_table = 'order'
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return f"{self.firstname} {self.lastname} ({self.inn})"

    @transition(field=status, source=[NEW, RETURNED], target=PROCESSING)
    def processed_by_cc(self):
        pass

    @transition(field=status, source=[PROCESSING], target=NEW)
    def cancel_process(self):
        pass

    @transition(field=status, source=[PROCESSING], target=CONFIRMED)
    def confirmed_by_cc(self):
        pass

    @transition(field=status, source=[PROCESSING], target=REJECTED)
    def rejected_by_cc(self):
        pass

    @transition(field=status, source=CONFIRMED, target=SEND)
    def send_to_print(self):
        pass

    @transition(field=status, source=CONFIRMED, target=RETURNED)
    def returned_by_specialist(self):
        pass

    @transition(field=status, source=SEND, target=PRINTED)
    def printed(self):
        pass

    @transition(field=status, source=PRINTED, target=DELIVERY_ACCEPTED)
    def delivery_accepted(self):
        pass

    @transition(field=status, source=DELIVERY_ACCEPTED, target=DELIVERY_REJECTED)
    def delivery_rejected(self):
        pass

    @transition(field=status, source=DELIVERY_ACCEPTED, target=DELIVERY_DONE)
    def delivery_succeeded(self):
        pass

    @transition(field=status, source=DELIVERY_ACCEPTED, target=DELIVERY_RETURNED)
    def delivery_returned(self):
        pass


class StatusHistory(models.Model):
    order = models.ForeignKey('Order', related_name='histories', on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey('User', related_name='histories', on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.SmallIntegerField(choices=STATUSES)

    class Meta:
        db_table = 'status_history'


class Branch(models.Model):
    address = models.TextField(default='')
    city = models.CharField(max_length=32, default='')
    longitude = models.CharField(max_length=32, default='')
    latitude = models.CharField(max_length=32, default='')

    class Meta:
        db_table = 'branch'
        verbose_name = 'Филиал'
        verbose_name_plural = 'Филиалы'

    def __str__(self):
        return f"{self.address} {self.city}"
