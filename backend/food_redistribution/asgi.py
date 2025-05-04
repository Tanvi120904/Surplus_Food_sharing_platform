import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import donations.routing  # 👈 make sure this exists

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'food_redistribution.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            donations.routing.websocket_urlpatterns
        )
    ),
})
