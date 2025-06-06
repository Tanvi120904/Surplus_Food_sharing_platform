# Generated by Django 5.1.7 on 2025-04-20 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0036_alter_shelter_contact_number_alter_shelter_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='deliverypartner',
            name='email',
        ),
        migrations.RemoveField(
            model_name='deliverypartner',
            name='phone',
        ),
        migrations.RemoveField(
            model_name='deliverypartner',
            name='user',
        ),
        migrations.RemoveField(
            model_name='deliverypartner',
            name='vehicle_number',
        ),
        migrations.RemoveField(
            model_name='deliverypartner',
            name='vehicle_type',
        ),
        migrations.AddField(
            model_name='deliverypartner',
            name='contact_number',
            field=models.CharField(default='0000000000', max_length=15),
        ),
        migrations.AddField(
            model_name='deliverypartner',
            name='location',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='deliverypartner',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]
