from rest_framework import serializers
from donations.models import Donation
from .models import Donation
from django.contrib.auth.models import User
from .models import Recipient
from django.utils.timezone import localtime
from django.utils import timezone
from django.utils import timezone
from .models import Notification
from rest_framework import serializers
from .models import Donor
from .models import (
    Donation,
    Recipient,
    Notification,
    Donor
)
from .models import Shelter
from .models import Feedback
from .models import Impact
from .models import DeliveryPartner
from .models import NotificationFeedback

class DonationSerializer(serializers.ModelSerializer):
    donor_name = serializers.CharField(source='donor.username', read_only=True)
    donor_address = serializers.SerializerMethodField()
    pickup_time = serializers.SerializerMethodField()
    delivery_partner_username = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()
    donor_location = serializers.SerializerMethodField()  # 👈 Change this line!
    pickup_latitude = serializers.FloatField(read_only=True)
    pickup_longitude = serializers.FloatField(read_only=True)
    food_item = serializers.CharField(read_only=True)  # Fixed this line

    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ['donor', 'pickup_latitude', 'pickup_longitude']

    def get_pickup_time(self, obj):
        if obj.pickup_time:
            local_time = timezone.localtime(obj.pickup_time)
            return local_time.strftime('%Y-%m-%d %I:%M %p')
        return None

    def get_delivery_partner_username(self, obj):
        if obj.delivery_partner and obj.delivery_partner.user:
            return obj.delivery_partner.user.username
        return None

    def get_donor_location(self, obj):
        return obj.donor_location or "Not provided"

    def get_donor_address(self, obj):
        donor_profile = getattr(obj.donor, 'donor', None)
        if donor_profile and donor_profile.address:
            return donor_profile.address
        return "Not provided"

    def get_status_display(self, obj):
        return obj.get_status_display()

    
class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = ['id', 'name', 'number_of_people', 'address', 'contact_number', 'latitude', 'longitude', 'added_by']



class ImpactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Impact
        fields = '__all__'

class RecipientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipient
        fields = '__all__'



class DonorRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ['username', 'email', 'phone', 'address']
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'timestamp']  

class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = '__all__'    

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'           

class DonorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donor
        fields = ['username', 'email', 'password', 'donor_type', 'address', 'phone']


class DeliveryPartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryPartner
        fields = ['id', 'name', 'contact_number', 'location','is_available']


class NotificationFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationFeedback
        fields = ['id', 'notification', 'user', 'feedback', 'rating', 'timestamp']
