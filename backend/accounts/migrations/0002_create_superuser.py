from django.db import migrations
from django.contrib.auth import get_user_model

def create_superuser(apps, schema_editor):
    User = get_user_model()
    # Replace these with your desired login details
    username = "admin"
    email = "admin@example.com"
    password = "YourSecretPassword123"

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username, email, password)

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0001_initial'), # Make sure this matches your actual first migration name
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]