# Generated by Django 3.1.7 on 2021-03-30 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20210329_1507'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='cancel_reason',
            field=models.TextField(default='', verbose_name='Причина отмены'),
        ),
    ]
