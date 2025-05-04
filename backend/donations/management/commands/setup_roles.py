from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):
    help = 'Setup roles and permissions for Donor, Recipient, and Admin groups'

    def handle(self, *args, **kwargs):
        # Create groups if they don't exist
        donor_group, created = Group.objects.get_or_create(name='Donor')
        recipient_group, created = Group.objects.get_or_create(name='Recipient')
        admin_group, created = Group.objects.get_or_create(name='Admin')

        # Get or create permissions
        add_donation_permission = Permission.objects.get(codename='add_donation')
        can_claim_donations_permission = Permission.objects.get(codename='can_claim_donations')

        # Assign permissions to groups
        donor_group.permissions.add(add_donation_permission)  # Donors can create donations
        recipient_group.permissions.add(can_claim_donations_permission)  # Recipients can claim donations
        admin_group.permissions.set(Permission.objects.all())  # Admins have all permissions

        self.stdout.write(self.style.SUCCESS('Successfully set up roles and permissions'))
