# Generated by Django 5.1.7 on 2025-04-19 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0031_donation_donor_location_alter_donation_food_item'),
    ]

    operations = [
        migrations.AddField(
            model_name='donation',
            name='pickup_address',
            field=models.TextField(blank=True, null=True),
        ),
    ]
