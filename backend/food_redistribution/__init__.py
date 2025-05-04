from django.apps import AppConfig

class DonationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'donations'  # ✅ Match this with INSTALLED_APPS
