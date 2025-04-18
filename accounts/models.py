from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.db.models.fields.related import OneToOneField

class Profile(models.Model):  # Renamed to `Profile` for standard naming convention
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='accounts_profile')
    bio = models.TextField(null=True)
    description = models.TextField(max_length=500, default='', null=True, blank=True)
    phone = models.CharField(max_length=20, null=True)
    profilePic = models.ImageField(upload_to='media/profile', default='def.jpg')
    company_name = models.CharField(max_length=100, default='', null=True, blank=True)

    def __str__(self):
        return str(self.user)

def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)  # Updated class name
        print('Profile created successfully.')

post_save.connect(create_profile, sender=User)
