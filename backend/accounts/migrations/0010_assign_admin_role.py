from django.db import migrations

def assign_admin_role(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    UserProfile = apps.get_model('accounts', 'UserProfile')
    
    admin_user = User.objects.filter(username='admin').first()
    if admin_user:
        # This ensures the admin user has a profile with the correct role
        UserProfile.objects.get_or_create(
            user=admin_user,
            defaults={'role': 'ADMIN'} # Matches your roleMenus logic
        )

class Migration(migrations.Migration):
    dependencies = [
    ('accounts', '0009_merge_20260211_1734'), # Use your EXACT filename here
    ]

    operations = [
        migrations.RunPython(assign_admin_role),
    ]