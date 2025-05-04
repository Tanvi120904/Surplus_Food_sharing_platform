from django.contrib import admin
from django.urls import path, include
from .views import ProtectedView, home_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),
    path('api/', include('donations.urls')),  # ✅ only this one
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/protected-route/', ProtectedView.as_view(), name='protected-route'),
]
