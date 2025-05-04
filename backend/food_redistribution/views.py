from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from donations.models import Donation
from donations.serializers import DonationSerializer



def home_view(request):
    return HttpResponse("<h1>Welcome to the Food Redistribution Platform!</h1>")
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected route"}, status=200)