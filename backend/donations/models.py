import requests
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from donations.utils import get_lat_lng_from_address
#from django.contrib.gis.db import models as geomodels
User = get_user_model()

class Donation(models.Model):
    donor = models.ForeignKey(User, on_delete=models.CASCADE)
    donor_location = models.CharField(max_length=255, null=True, blank=True)  # 📍 Must exist
    food_item = models.CharField(max_length=100)  # 🍱 Must exist
    quantity = models.IntegerField()
    pickup_address = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    pickup_location = models.CharField(max_length=255, null=True, blank=True)
    pickup_latitude = models.FloatField(null=True, blank=True)
    pickup_longitude = models.FloatField(null=True, blank=True)
    #location = geomodels.PointField(geography=True, null=True, blank=True)
    pickup_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status_updated_at = models.DateTimeField(auto_now=True)
    delivery_partner = models.ForeignKey(
        'DeliveryPartner',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_deliveries'
    )
    donor_type = models.CharField(max_length=100, default='individual')
    is_active = models.BooleanField(default=True)  # 🔥 Mark if donation is active
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_available = models.BooleanField(default=True)
    def save(self, *args, **kwargs):
        # Optional: Only if you are using PointField (commented in your model)
        if self.pickup_latitude and self.pickup_longitude:
            try:
                from django.contrib.gis.geos import Point
                self.location = Point(self.pickup_longitude, self.pickup_latitude)
            except Exception as e:
                print("Skipping Point creation due to:", e)

        super().save(*args, **kwargs)

class Donor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='donor')
    username = models.CharField(max_length=100)  # remove unique
    email = models.EmailField()  # remove unique=True
    phone = models.CharField(max_length=15)
    address = models.TextField()
    rating = models.FloatField(null=True, blank=True)
    donor_type = models.CharField(
        max_length=50,
        choices=[
            ('Restaurant', 'Restaurant'),
            ('Hotel', 'Hotel'),
            ('Bakery', 'Bakery'),
            ('Individual', 'Individual')
        ]
    )

    def __str__(self):
        return self.user.username if self.user else self.username

class Request(models.Model):
    requester_name = models.CharField(max_length=255, default="Unknown")
    food_needed = models.CharField(max_length=255, default="Not specified")
    quantity_requested = models.IntegerField(default=1)
    status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Fulfilled', 'Fulfilled')],
        default='Pending'
    )
    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.requester_name} - {self.food_needed}"


class Impact(models.Model):
    total_donations = models.PositiveIntegerField(default=0)
    monthly_growth = models.FloatField(default=0.0)
    people_helped = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"Impact Stats - {self.total_donations} Donations"


class Recipient(models.Model):
    RECIPIENT_TYPES = [
        ('orphanage', 'Orphanage'),
        ('oldage_home', 'Old Age Home'),
        ('shelter', 'Shelter'),
        ('ngo', 'NGO'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    address = models.TextField()
    phone = models.CharField(max_length=15)
    recipient_type = models.CharField(
        max_length=50,
        choices=RECIPIENT_TYPES,
        default='ngo'
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.address and (self.latitude is None or self.longitude is None):
            lat, lng = get_lat_lng_from_address(self.address)
            if lat and lng:
                self.latitude = lat
                self.longitude = lng
        super().save(*args, **kwargs)


class DeliveryPartner(models.Model):
    name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15, default='0000000000')
    location = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    receiver = models.ForeignKey('Receiver', on_delete=models.CASCADE, related_name="delivery_partners", default=1)  # Assuming Receiver with ID 1 exists
    is_available = models.BooleanField(default=True)
    def __str__(self):
        return self.name
    is_available = models.BooleanField(default=True)  # 🔥 Mark availability
class Shelter(models.Model):
    name = models.CharField(max_length=255)
    number_of_people = models.IntegerField()
    address = models.TextField()
    contact_number = models.CharField(max_length=15)
    latitude = models.FloatField()
    longitude = models.FloatField()
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name   

class Notification(models.Model):
    delivery_partner = models.ForeignKey(DeliveryPartner, on_delete=models.CASCADE)
    donation = models.ForeignKey(Donation, on_delete=models.CASCADE)
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE, default=1)  # Set default here
    status = models.CharField(max_length=50, choices=[
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('seen', 'Seen'),
        ('acknowledged', 'Acknowledged'),
        ('failed', 'Failed')
    ], default='sent')  # Default to 'sent'
    timestamp = models.DateTimeField(auto_now_add=True)

class Feedback(models.Model):
    donation = models.OneToOneField(Donation, on_delete=models.CASCADE, related_name='feedback')
    recipient = models.ForeignKey(Recipient, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)  # 1 to 5 stars
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Feedback for {self.donation.food_item} - {self.rating} stars"


class Receiver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    organization_type = models.CharField(max_length=255)
    organization_name = models.CharField(max_length=255)
    email = models.EmailField()
    contact_number = models.CharField(max_length=20)
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.organization_name   


class NotificationFeedback(models.Model):
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback = models.TextField()
    rating = models.IntegerField(choices=[(1, 'Poor'), (2, 'Fair'), (3, 'Good'), (4, 'Very Good'), (5, 'Excellent')])
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for Notification {self.notification.id} - {self.rating} stars"

