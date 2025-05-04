from rest_framework import viewsets
from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import (
    ListCreateAPIView, ListAPIView, UpdateAPIView,
    RetrieveUpdateDestroyAPIView, DestroyAPIView
)
from rest_framework.exceptions import NotFound
import logging
from .models import Donation, DeliveryPartner
import requests
from .models import NotificationFeedback, Notification
from .serializers import NotificationFeedbackSerializer 
from geopy.geocoders import Nominatim
import math
from .serializers import DeliveryPartnerSerializer
from .models import DeliveryPartner, Donation, Shelter, Notification
from .serializers import DeliveryPartnerSerializer
from donations.utils import geocode_address
from django.contrib.auth.decorators import login_required
from collections import defaultdict
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
import uuid
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password 
from rest_framework.authentication import SessionAuthentication
from .models import Receiver
from django.contrib.auth import authenticate
from .utils import get_lat_lng_from_address, reverse_geocode 
from django.contrib.auth.models import User
from django.db.models import Sum, Avg
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Donation, Donor, Recipient, DeliveryPartner, Notification, Feedback
from .serializers import (
    DonationSerializer, DonorSerializer, DonorRegistrationSerializer,
    RecipientSerializer, FeedbackSerializer, NotificationSerializer
)
from django.db import IntegrityError

from .models import Donor, Recipient  # Recipient = Receiver
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from .utils.distance import haversine_distance
from .utils import get_lat_lng_from_address
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
# List all donations & create new donation
from .models import Impact
from .serializers import ImpactSerializer
from django.utils.timezone import now
from django.db.models.functions import TruncMonth
from django.db.models import Count
from datetime import datetime  # ✅ import like this
import calendar
from django.contrib.auth.hashers import make_password
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from .models import Recipient
from django.db.models import F
from math import radians, cos, sin, asin, sqrt
from geopy.distance import geodesic
import json
from django.http import JsonResponse
from rest_framework.authtoken.views import ObtainAuthToken
import traceback
from django.db.models import Sum
from .consumers import DonationConsumer
from .utils import get_lat_lng_from_address, reverse_geocode
from .models import Shelter
from .serializers import ShelterSerializer
import requests

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Skip CSRF check

@api_view(['POST'])
def create_donation(request):
    # Your logic to create a new donation
    donation = Donation.objects.create(
        donor=request.user,
        food_item=request.data['food_item'],
        quantity=request.data['quantity'],
        location=request.data['location'],
        pickup_time=request.data['pickup_time'],
        # etc...
    )
    DonationConsumer.notify_donation_update(donation)  # Notify receivers about new donation
    return JsonResponse({"message": "Donation created successfully"})


@method_decorator(csrf_exempt, name='dispatch')
class DonationListCreateView(ListCreateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        address = serializer.validated_data.get('pickup_location')

        lat, lng = None, None
        location_name = "Unknown"

        if address:
            lat, lng = get_lat_lng_from_address(address)
            if lat and lng:
                location_name = reverse_geocode(lat, lng) or "Unknown"

        pickup_address = getattr(self.request.user.donor, 'address', None)

        serializer.save(
            donor=self.request.user,
            pickup_latitude=lat,
            pickup_longitude=lng,
            donor_location=location_name,
            status='pending',
            pickup_address=pickup_address
        )

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register_donor(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        address = data.get('address')
        phone = data.get('phone')
        donor_type = data.get('donor_type')

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)

        Donor.objects.create(
            user=user,
            address=address,
            phone=phone,
            donor_type=donor_type
        )

        return JsonResponse({'message': 'Donor registered successfully'})



class DonorLoginView(ObtainAuthToken):
    permission_classes = [AllowAny]
    authentication_classes = []  # Important: disables CSRF checking

    @method_decorator(csrf_exempt)  # This is key to bypass CSRF for this view
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            'user_id': token.user_id,
        })

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def donor_dashboard_stats(request):
    donor = request.user

    total_donations = Donation.objects.filter(donor=donor).count()
    people_served = total_donations * 4  # Example logic
    feedbacks = Feedback.objects.filter(donation__donor=donor)
    avg_rating = round(feedbacks.aggregate(Avg("rating"))["rating__avg"] or 0, 1)

    return Response({
        "donations_made": total_donations,
        "people_served": people_served,
        "average_rating": avg_rating,
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def donor_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    print("Login attempt:", username, password)

    user = authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'message': 'Login successful',
            'token': token.key,
            'user_id': user.id,
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@csrf_exempt
@api_view(['POST'])
def donor_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print("Login attempt:", username, password)

    user = authenticate(username=username, password=password)
    if user is not None:
        print("Authentication success")
        return Response({'message': 'Login successful', 'user_id': user.id})
    else:
        print("Authentication failed")
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@permission_classes([IsAuthenticated])
def donor_dashboard_data(request):
    user = request.user
    print("User:", request.user)
    print("Auth:", request.auth)

    try:
        donor = Donor.objects.get(user=user)
    except Donor.DoesNotExist:
        return Response({"error": "Donor profile not found."}, status=404)

    # ✅ Fix: Use donor instead of user in filters
    donations_made = Donation.objects.filter(donor=donor).count()
    people_served = Donation.objects.filter(donor=donor).aggregate(
        total=Sum('quantity')
    )['total'] or 0

    average_rating = 0  # Optional placeholder (can be updated later)

    data = {
        "donations_made": donations_made,
        "people_served": people_served,
        "average_rating": average_rating,
    }

    return Response(data)

class DonorRegisterView(APIView):
    permission_classes = [AllowAny]  # 👈 This allows anyone (even not logged in)

    def post(self, request):
        serializer = DonorSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Donor registered successfully"}, status=status.HTTP_201_CREATED)
        else:
            print("Validation Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    
# CRUD for Donations
class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['food_item', 'pickup_location']
    def perform_create(self, serializer):
        from rest_framework.exceptions import PermissionDenied

        # Check if the user has an associated Donor profile
        try:
            donor = self.request.user.donor
        except Donor.DoesNotExist:
            raise PermissionDenied("You must be registered as a donor to create a donation.")
        
        # Process donation if donor profile exists
        address = self.request.data.get('pickup_location')
        lat, lng = get_lat_lng_from_address(address)
        donation = serializer.save(donor=donor, pickup_latitude=lat, pickup_longitude=lng)

        # WebSocket notification
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "donation_updates",
            {
                "type": "donation_update",
                "donation_data": {
                    "id": donation.id,
                    "food_item": donation.food_item,
                    "pickup_location": donation.pickup_location,
                    "quantity": donation.quantity,
                    "status": donation.status,
                    "donor": donation.donor.username,
                }
            }
        )
    @action(detail=False, methods=['post'], url_path='confirm-pickup', permission_classes=[IsAuthenticated])
    def confirm_pickup(self, request):
        donation_id = request.data.get("donation_id")

        if not donation_id:
            return Response({"error": "Donation ID required."}, status=400)

        try:
            donation = Donation.objects.get(id=donation_id)

            if not hasattr(request.user, 'recipient'):
                return Response({"error": "Recipient profile not found."}, status=404)

            donation.recipient = request.user.recipient
            donation.status = 'picked_up'
            donation.save()

            return Response({"message": "Donation confirmed successfully."})

        except Donation.DoesNotExist:
            return Response({"error": "Donation not found."}, status=404)

# Protected API View
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected route"}, status=200)

# Update a donation
class DonationUpdateView(UpdateAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        serializer.save()

# Retrieve, Update, and Delete a donation
class DonationDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    lookup_field = 'pk'

# Soft delete (mark as inactive)
class DonationDeleteView(DestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

# List all recipients
class ImpactTrackerView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        impact = Impact.objects.first()
        serializer = ImpactSerializer(impact)
        return Response(serializer.data)

class ImpactView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = now().date()

        donations = Donation.objects.filter(donor=user)

        total_donations = donations.count()
        donations_today = donations.filter(created_at__date=today).count()
        people_helped = total_donations * 4  # ✅ Updated logic

        average_rating = donations.filter(feedback__rating__isnull=False).aggregate(
            avg=Avg("feedback__rating")
        )["avg"] or 0.0

        recent_donations = donations.order_by("-created_at")[:5]
        recent_data = [
            {
                "food_item": d.food_item,
                "quantity": d.quantity,
                "status": d.status,
                "created_at": d.created_at.strftime("%b %d, %Y"),
            }
            for d in recent_donations
        ]

        chart_data = defaultdict(int)
        for d in donations:
            month = d.created_at.strftime("%b")
            chart_data[month] += 1

        months_order = list(calendar.month_abbr)[1:]  # ['Jan', 'Feb', ..., 'Dec']
        sorted_chart = [
            {
                "month": m,
                "donations": chart_data[m],
            }
            for m in months_order
        ]

        monthly_growth = 15.25  # Just a placeholder

        return Response({
            "total_donations": total_donations,
            "people_helped": people_helped,
            "meals_served_today": total_donations,
            "average_rating": round(average_rating, 2),
            "recent_donations": recent_data,
            "monthly_chart_data": sorted_chart,
            "monthly_growth": monthly_growth,
        }, status=status.HTTP_200_OK)


class RecipientList(ListAPIView):
    queryset = Recipient.objects.all()
    serializer_class = RecipientSerializer
    permission_classes = [IsAuthenticated]

class DeliveryPartnerNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user).order_by('-timestamp')  # 🔁 FIXED
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)


def haversine(lat1, lon1, lat2, lon2):
    # Haversine formula to calculate distance
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1 
    dlon = lon2 - lon1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371  # Radius of earth in km
    return c * r

from geopy.distance import geodesic
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .models import Donation


@api_view(['GET'])
@authentication_classes([JWTAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def nearby_donations(request):
    lat = request.GET.get('lat')
    lng = request.GET.get('lng')

    if not lat or not lng:
        return JsonResponse({'error': 'Latitude and longitude are required.'}, status=400)

    try:
        lat = float(lat)
        lng = float(lng)
    except ValueError:
        return JsonResponse({'error': 'Invalid latitude or longitude format.'}, status=400)

    try:
        all_donations = Donation.objects.filter(
            status="pending",
            donor__is_active=True
        )

        nearby_donations = []
        for donation in all_donations:
            if donation.pickup_latitude is not None and donation.pickup_longitude is not None:
                distance = haversine(lat, lng, donation.pickup_latitude, donation.pickup_longitude)
                if distance <= 50:  # Only donations within 50 km
                    nearby_donations.append(donation)

        serializer = DonationSerializer(nearby_donations, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        print("🚨 Error fetching nearby donations:", str(e))
        return JsonResponse({'error': 'An error occurred while fetching donations.'}, status=500)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def nearby_donations(request):
    lat = request.GET.get('lat')
    lng = request.GET.get('lng')

    if not lat or not lng:
        return JsonResponse({'error': 'Latitude and longitude are required.'}, status=400)

    try:
        lat = float(lat)
        lng = float(lng)
    except ValueError:
        return JsonResponse({'error': 'Invalid latitude or longitude format.'}, status=400)

    try:
        all_donations = Donation.objects.filter(
            status="pending",
            is_available=True,
            donor__is_active=True
        )

        nearby_donations = []
        for donation in all_donations:
            if donation.pickup_latitude is not None and donation.pickup_longitude is not None:
                distance = haversine(lat, lng, donation.pickup_latitude, donation.pickup_longitude)
                if distance <= 50:
                    nearby_donations.append(donation)

        serializer = DonationSerializer(nearby_donations, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_ngo_type(request):
    new_type = request.data.get('recipient_type')

    valid_types = dict(Recipient.RECIPIENT_TYPES).keys()

    if new_type not in valid_types:
        return Response(
            {"error": f"Invalid recipient_type. Choose from: {', '.join(valid_types)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        recipient = request.user.recipient
        recipient.recipient_type = new_type
        recipient.save()

        return Response({"message": "NGO type updated successfully."})

    except Recipient.DoesNotExist:
        return Response({"error": "Recipient profile not found."}, status=404)


# views.py

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_delivery_partner(request, donation_id):
    try:
        donation = Donation.objects.get(id=donation_id)
    except Donation.DoesNotExist:
        return Response({"error": "Donation not found"}, status=404)

    partner_id = request.data.get('delivery_partner_id')
    try:
        delivery_partner = DeliveryPartner.objects.get(id=partner_id)
    except DeliveryPartner.DoesNotExist:
        return Response({"error": "Delivery Partner not found"}, status=404)

    # ✅ Assign the partner
    donation.delivery_partner = delivery_partner
    donation.status = "assigned"
    donation.save()

    # ✅ 📬 CREATE NOTIFICATION HERE
    from .models import Notification
    Notification.objects.create(
        user=delivery_partner.user,  # FK to User
        message=f"You’ve been assigned a new donation pickup at {donation.pickup_location}!",
    )

    return Response({"message": "Delivery partner assigned and notified."})


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ✅ Add this!
def delivery_partner_dashboard(request):
    user = request.user

    try:
        delivery_partner = DeliveryPartner.objects.get(user=request.user)
    except DeliveryPartner.DoesNotExist:
        return Response({'detail': 'Not a delivery partner'}, status=403)


    donations = Donation.objects.filter(delivery_partner=delivery_partner)
    donations = donations.filter(status__in=["assigned", "in_transit"])

    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def assigned_donations(request):
    user = request.user
    delivery_partner = getattr(user, 'deliverypartner', None)

    if not delivery_partner:
        return Response({'detail': 'You are not registered as a delivery partner.'}, status=403)

    donations = Donation.objects.filter(delivery_partner=delivery_partner)
    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data)    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_feedback(request):
    serializer = FeedbackSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(recipient=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_donor_average_rating(request, donor_id):
    avg_rating = Feedback.objects.filter(donor__id=donor_id).aggregate(average=Avg('rating'))['average']
    return Response({'donor_id': donor_id, 'average_rating': avg_rating or 0}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def donor_dashboard(request):
    user = request.user
    donations = Donation.objects.filter(donor=user)

    total_donations = donations.count()  # same as meals_served_today
    today = datetime.now().date()
    donations_today = donations.filter(created_at__date=today).count()
    people_served = donations_today * 3

    feedbacks = Feedback.objects.filter(donation__donor=user)
    avg_rating = feedbacks.aggregate(Avg('rating'))['rating__avg'] or 0

    recent_donations = [
        {
            "food_item": d.food_item,
            "quantity": d.quantity,
            "status": d.status,
            "created_at": d.created_at.strftime('%Y-%m-%d %H:%M'),
        }
        for d in donations.order_by('-created_at')[:5]
    ]

    data = {
        "donations_made": total_donations,
        "people_served": people_served,
        "meals_served_today": total_donations,
        "average_rating": round(avg_rating, 2),
        "recent_donations": recent_donations,
    }

    return Response(data)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def donor_dashboard_combined(request):
    user = request.user
    donations = Donation.objects.filter(donor=user)

    total_donations = donations.count()
    today = datetime.now().date()
    donations_today = donations.filter(created_at__date=today).count()

    people_served = total_donations * 4  # Real logic
    meals_served_today = donations_today  # Just a count of today's donations

    feedbacks = Feedback.objects.filter(donation__donor=user)
    avg_rating = round(feedbacks.aggregate(Avg("rating"))["rating__avg"] or 0, 1)

    recent_donations = [
        {
            "food_item": d.food_item,
            "quantity": d.quantity,
            "status": d.status,
            "created_at": d.created_at.strftime('%Y-%m-%d %H:%M'),
        }
        for d in donations.order_by('-created_at')[:5]
    ]

    return Response({
        "donations_made": total_donations,
        "people_served": people_served,
        "meals_served_today": meals_served_today,
        "average_rating": avg_rating,
        "recent_donations": recent_donations,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def receiver_dashboard(request):
    try:
        recipient = request.user.recipient
    except Recipient.DoesNotExist:
        return Response({"error": "Recipient profile not found."}, status=404)

    donations = Donation.objects.filter(recipient=recipient)
    total_donations = donations.count()
    people_served = donations.aggregate(total=Sum("quantity"))["total"] or 0

    return Response({
        "donations_received": total_donations,
        "people_served": people_served
    })    


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def donor_profile(request):
    serializer = DonorSerializer(request.user.donor)
    return Response(serializer.data)    


class ReceiverLoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=400)

        # Authenticate user
        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials'}, status=400)

        # If authenticated, generate token
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=200)


class ReceiverRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        required_fields = ["organization_type", "organization_name", "email", "contact_number", "location", "password"]

        for field in required_fields:
            if not data.get(field):
                return Response({"error": f"{field} is required"}, status=400)

        # Check for existing username or email
        username = data["organization_name"]  # using org name as username
        email = data["email"]
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        # Create user
        user = User.objects.create_user(
            username=username,
            password=data["password"],
            email=email
        )

        # Save receiver
        Receiver.objects.create(
            user=user,
            organization_type=data["organization_type"],
            organization_name=username,
            contact_number=data["contact_number"],
            location=data["location"],
        )

        return Response({"message": "Receiver registered successfully"}, status=201)



class DonorRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        donor_type = request.data.get("donor_type")
        phone = request.data.get("phone")
        address = request.data.get("address")

        # 👇 Use username from request or fallback to email prefix
        username = request.data.get("username") or email.split('@')[0]

        # Check for existing email
        if User.objects.filter(email=email).exists():
            return Response({"error": "A user with this email already exists."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Ensure username uniqueness
        if User.objects.filter(username=username).exists():
            username = str(uuid.uuid4())[:10]

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )

            Donor.objects.create(
                user=user,
                donor_type=donor_type,
                phone=phone,
                address=address
            )

            return Response({
                "message": "Donor registered successfully",
                "user_id": user.id
            }, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            print("IntegrityError:", str(e))
            traceback.print_exc()
            return Response({"error": "User creation failed due to integrity error."},
                            status=status.HTTP_400_BAD_REQUEST)

class DonorLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user_id": user.id,
                "username": user.username,
            })
        else:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def available_donations(request):
    donations = Donation.objects.filter(status='pending')  # or add more filters
    serializer = DonationSerializer(donations, many=True)
    return Response(serializer.data)



def geocode_address(address):
    url = 'https://nominatim.openstreetmap.org/search'
    params = {
        'q': address,
        'format': 'json',
        'addressdetails': 1,
        'limit': 1
    }
    response = requests.get(url, params=params)
    try:
        data = response.json()
    except ValueError:
        return None, None

    if not data:
        return None, None

    return data[0]['lat'], data[0]['lon']


class AddShelterView(APIView):
    def post(self, request):
        print("\n🌍 Inside AddShelterView.post")
        data = request.data
        print("📬 Request data:", data)

        name = data.get("name")
        number_of_people = data.get("number_of_people")
        address = data.get("address")
        contact_number = data.get("contact_number")
        receiver_id = request.user.id  # Assumes token/session auth

        print("📍 Geocoding address:", address)
        geolocator = Nominatim(user_agent="hopeplates-app")
        location = geolocator.geocode(address)

        if location is None:
            print("❌ Geocoding failed.")
            return Response({"error": "Failed to geocode address"}, status=status.HTTP_400_BAD_REQUEST)

        lat = location.latitude
        lng = location.longitude
        print(f"📌 Result: {lat}, {lng}")

        shelter = Shelter.objects.create(
            name=name,
            number_of_people=number_of_people,
            address=address,
            contact_number=contact_number,
            latitude=lat,
            longitude=lng,
            added_by=User.objects.get(id=receiver_id)
        )
        return Response({"message": "Shelter added successfully"}, status=status.HTTP_201_CREATED)

class MySheltersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")

        user_shelters = Shelter.objects.filter(added_by=user)

        if not user_shelters.exists():
            return Response({"message": "You have not added any shelters yet."}, status=200)

        # If donor location is provided
        if lat and lon:
            nearby_shelters = []
            for shelter in user_shelters:
                distance = calculate_distance(float(lat), float(lon), shelter.latitude, shelter.longitude)
                if distance <= 50:
                    nearby_shelters.append(shelter)

            serializer = ShelterSerializer(nearby_shelters, many=True)
        else:
            # Just return all shelters added by this user
            serializer = ShelterSerializer(user_shelters, many=True)

        return Response(serializer.data)

@login_required
def my_shelters(request):
    if request.method == 'GET':
        user = request.user
        # Assuming your Shelter model has a ForeignKey to NGO user
        shelters = Shelter.objects.filter(ngo=user)
        data = [{'name': s.name, 'address': s.address} for s in shelters]
        return JsonResponse({'shelters': data})


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in KM
    lat1_rad, lon1_rad = math.radians(lat1), math.radians(lon1)
    lat2_rad, lon2_rad = math.radians(lat2), math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c



@api_view(['GET'])
def get_delivery_partners(request):
    partners = DeliveryPartner.objects.all()
    data = [
        {
            'id': partner.id,
            'name': partner.name,
            'contact_number': partner.contact_number,
        }
        for partner in partners
    ]
    return JsonResponse(data, safe=False)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def receiver_delivery_partners(request):
    receiver = request.user.receiver
    partners = DeliveryPartner.objects.filter(receiver=receiver)

    if not partners.exists():
        return Response({
            "message": "No delivery partners found",
            "partners": [],
            "all_partners": [],
            "available_partners": []
        })

    all_serializer = DeliveryPartnerSerializer(partners, many=True)
    available_serializer = DeliveryPartnerSerializer(
        partners.filter(is_available=True), many=True
    )

    return Response({
        "message": "Delivery partners fetched successfully",
        "partners": all_serializer.data,
        "all_partners": all_serializer.data,
        "available_partners": available_serializer.data

    })


@api_view(['POST'])
def send_notification(request):
    data = request.data
    try:
        donation = Donation.objects.get(id=data['donor_id'])
        shelter = Shelter.objects.get(id=data['shelter_id'])
        delivery_partner = DeliveryPartner.objects.get(id=data['delivery_partner_id'])

        # Create notification record (or your preferred logic)
        Notification.objects.create(
            donation=donation,
            shelter=shelter,
            delivery_partner=delivery_partner,
            status="Sent"
        )

        return Response({"message": "Notification sent successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error:", e)
        return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

geolocator = Nominatim(user_agent="food_redistribution")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_delivery_partner(request):
    receiver = request.user.receiver
    name = request.data.get('name')
    contact_number = request.data.get('contact_number')
    location = request.data.get('location')

    if not location:
        return Response({"error": "Location is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Geocode the location to get latitude and longitude
    try:
        geocode = geolocator.geocode(location)
        if geocode:
            latitude = geocode.latitude
            longitude = geocode.longitude
        else:
            return Response({"error": "Location not found."}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        print("Geocoding error:", e)
        return Response({"error": "Failed to geocode location."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Create DeliveryPartner with geocoded lat/long
    partner = DeliveryPartner.objects.create(
        receiver=receiver,
        name=name,
        contact_number=contact_number,
        location=location,
        latitude=latitude,
        longitude=longitude,
        is_available=True  # ✅ This line is required
    )

    return Response({'message': 'Delivery partner added successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@authentication_classes([JWTAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def assign_delivery_partner(request):
    try:
        donation_id = request.data.get('donation_id')
        partner_id = request.data.get('partner_id')
        destination_address = request.data.get('destination_address')  # 🚚 From shelter/orphanage

        if not donation_id or not partner_id or not destination_address:
            return JsonResponse({'error': 'All fields are required.'}, status=400)

        donation = Donation.objects.get(id=donation_id)
        partner = DeliveryPartner.objects.get(id=partner_id)

        # Assign the delivery partner
        donation.delivery_partner = partner
        donation.status = 'assigned'
        donation.save()

        # Compose notification message
        source = donation.donor_location or donation.pickup_location or "Not Provided"
        message = f"📦 New delivery assigned!\nFrom: {source}\nTo: {destination_address}"

        # Create notification
        Notification.objects.create(
            delivery_partner=partner,
            message=message
        )

        return JsonResponse({'success': True, 'message': 'Delivery partner assigned and notified.'})

    except Donation.DoesNotExist:
        return JsonResponse({'error': 'Donation not found.'}, status=404)
    except DeliveryPartner.DoesNotExist:
        return JsonResponse({'error': 'Delivery partner not found.'}, status=404)
    except Exception as e:
        print("🚨 Error assigning delivery partner:", e)
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@authentication_classes([JWTAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_partner_notifications(request):
    try:
        partner = DeliveryPartner.objects.get(user=request.user)
        notifications = Notification.objects.filter(delivery_partner=partner).order_by('-timestamp')
        data = [
            {
                'message': n.message,
                'timestamp': n.timestamp,
                'is_read': n.is_read
            }
            for n in notifications
        ]
        return JsonResponse(data, safe=False)
    except DeliveryPartner.DoesNotExist:
        return JsonResponse({'error': 'Delivery partner not found'}, status=404)

@api_view(['GET'])
def get_notifications(request):
    notifications = Notification.objects.all()  # Or filter based on user, if necessary
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def acknowledge_notification(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id)
        notification.status = 'acknowledged'  # Update to 'acknowledged'
        notification.save()

        return Response({"message": "Notification acknowledged."}, status=200)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=404)


@api_view(['POST'])
def submit_feedback(request, notification_id):
    try:
        notification = Notification.objects.get(id=notification_id)
        feedback = request.data.get("feedback")
        rating = request.data.get("rating")

        # Create feedback entry
        NotificationFeedback.objects.create(
            notification=notification,
            user=request.user,
            feedback=feedback,
            rating=rating
        )

        return Response({"message": "Feedback submitted."}, status=200)
    except Notification.DoesNotExist:
        return Response({"error": "Notification not found."}, status=404)








@api_view(['POST'])
def confirm_donation(request, donation_id):
    # Fetch the donation and delivery partner
    donation = Donation.objects.filter(id=donation_id, is_available=True).first()
    delivery_partner_id = request.data.get('delivery_partner_id')
    partner = DeliveryPartner.objects.filter(id=delivery_partner_id, is_available=True).first()

    if not donation:
        raise NotFound("Donation not found or already completed.")
    if not partner:
        raise NotFound("Delivery partner not found or already assigned.")

    # Mark donation as unavailable (it should not appear again)
    donation.is_available = False
    donation.save()

    # Mark delivery partner as unavailable
    partner.is_available = False
    partner.save()

    return Response({"message": "Donation confirmed and delivery partner assigned."})