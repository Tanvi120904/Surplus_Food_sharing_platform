from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
    DonationViewSet,
    DonationListCreateView,
    DonationDetailView,
    DonationUpdateView,
    RecipientList,
    nearby_donations,
    ProtectedView,
    update_ngo_type,
    DeliveryPartnerNotificationsView,
    delivery_partner_dashboard,
    assign_delivery_partner,
    assigned_donations,
    add_delivery_partner,
    receiver_delivery_partners,
    assign_delivery_partner
)
from .views import MySheltersView
from .views import AddShelterView
from .views import DonorRegisterView
from .views import DonorLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import donor_login 
from .views import donor_dashboard
#from .views import donor_dashboard_data
from .views import submit_feedback, get_donor_average_rating
from rest_framework.authtoken.views import obtain_auth_token
from .views import donor_dashboard_stats
from .views import ImpactTrackerView
from .views import ImpactView
from .views import ReceiverLoginView
from .views import ReceiverRegisterView
from .views import available_donations
from .views import register_donor
from .views import my_shelters
from .views import donor_dashboard_combined
from .views import get_partner_notifications
from .views import get_notifications
from .views import confirm_donation

router = DefaultRouter()
#router.register(r'donations', DonationViewSet)

urlpatterns = [
    path('donors/register/', DonorRegisterView.as_view(), name='donor-register'),
   # path('donors/register/', register_donor, name='donor-register'),
    #path('donors/login/', views.donor_login, name='donor-login'),
    path('donors/login/', DonorLoginView.as_view(), name='donor-login'),
    #path('dashboard/', donor_dashboard_data, name='donor-dashboard'),
    path('donor-dashboard-new/', donor_dashboard, name='donor-dashboard-new'),
    path('donor-dashboard-combined/', donor_dashboard_combined, name='donor-dashboard-combined'),
    path('donors/dashboard-stats/', donor_dashboard_stats, name='donor-dashboard-stats'),
    path('donations/', DonationListCreateView.as_view(), name='donation-list-create'),
    #path("impact/static/", ImpactTrackerView.as_view()),  # or remove this if not needed
    path("impact/", ImpactView.as_view()),
    path('donor/dashboard/', donor_dashboard, name='donor_dashboard'),
    path('feedback/submit/', submit_feedback, name='submit_feedback'),
    path('feedback/average/<int:donor_id>/', get_donor_average_rating, name='get_donor_average_rating'),
    #path('donor/dashboard-stats/', donor_dashboard_stats, name='donor-dashboard-stats'),
    path('api/nearby-donations/', nearby_donations, name='nearby_donations'),
    path('my-shelters/', MySheltersView.as_view(), name='my-shelters'),
    path("add-shelter/", AddShelterView.as_view(), name="add_shelter"), 
    path("nearby-donations/", nearby_donations, name="nearby_donations"),
    path('donations/', available_donations, name='available_donations'),
    #path('donations/confirm-pickup/', confirm_donation),
    path('donations/update/<int:pk>/', DonationUpdateView.as_view(), name='donation-update'),
    path('recipients/', RecipientList.as_view(), name='recipient-list'),
    path('register-receiver/', ReceiverRegisterView.as_view(), name='register-receiver'),
    path('api/receivers/login/', ReceiverLoginView.as_view(), name='receiver-login'),
    path('add-delivery-partner/', add_delivery_partner),
    path('api/receiver-delivery-partners/', receiver_delivery_partners),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected-route/', ProtectedView.as_view(), name='protected-route'),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('recipient/update-type/', update_ngo_type, name='update-ngo-type'),
    path("api/add-delivery-partner/", views.add_delivery_partner, name="add_delivery_partner"),
    path('delivery-partners/', views.get_delivery_partners, name='delivery-partners'),
    path('send-notification/', views.send_notification, name='send-notification'),
    path('receiver-delivery-partners/', receiver_delivery_partners, name='receiver-delivery-partners'),
    # ✅ Corrected this line
    path("assign-delivery/", assign_delivery_partner, name="assign_delivery_partner"),
    path("notifications/", get_partner_notifications, name="get_partner_notifications"),
    path('api/notifications/', views.get_notifications, name='get_notifications'),
    path('assign-delivery-partner/<int:donation_id>/', assign_delivery_partner, name='assign-delivery-partner'),
    path('donors/login/', DonorLoginView.as_view(), name='donor-login'),
    path('delivery-partner/donations/', assigned_donations, name='assigned_donations'),
    path('delivery-partner/dashboard/', delivery_partner_dashboard, name='delivery_partner_dashboard'),
    path('delivery-partner/notifications/', DeliveryPartnerNotificationsView.as_view(), name='delivery-partner-notifications'),
    path('confirm-donation/<int:donation_id>/', confirm_donation, name='confirm-donation'),
    path('my-shelters/', my_shelters, name='my_shelters'),
    path('', include(router.urls)),  # Always last
]
