# Generated by Django 5.1.7 on 2025-04-05 13:18

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0009_impact_remove_donation_is_active_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='donation',
            options={},
        ),
        migrations.RemoveField(
            model_name='donation',
            name='donated_at',
        ),
        migrations.RemoveField(
            model_name='donation',
            name='donor_name',
        ),
        migrations.AddField(
            model_name='donation',
            name='pickup_latitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='donation',
            name='pickup_longitude',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='donation',
            name='pickup_time',
            field=models.DateTimeField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='recipient',
            name='recipient_type',
            field=models.CharField(choices=[('orphanage', 'Orphanage'), ('oldage_home', 'Old Age Home'), ('shelter', 'Shelter'), ('ngo', 'NGO')], default='ngo', max_length=50),
        ),
        migrations.AlterField(
            model_name='donation',
            name='donor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='donation',
            name='pickup_location',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='donation',
            name='quantity',
            field=models.IntegerField(),
        ),
    ]
