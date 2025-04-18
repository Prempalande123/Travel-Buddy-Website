from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import math
import datetime

# Event Category Model
class event_catagorey(models.Model):
    name = models.TextField(max_length=100)

# Tag Model
class Tag(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return str(self.name)

# Event Model
class event(models.Model):
    EVENT_TYPES = (
        ('in_person', 'In-Person'),
        ('online', 'Online'),
    )
    name = models.TextField(max_length=100)
    description = models.TextField()
    orginzer = models.ForeignKey(User, models.CASCADE, related_name='orgnizer')
    participants = models.ManyToManyField(User, default=None, blank=True)
    city = models.TextField(max_length=200, default='')
    state = models.TextField(max_length=200, default='')
    date = models.DateField()
    educational_leave = models.BooleanField(default=False)
    max_participants = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='in_person')
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return str(self.name)

    @property
    def num_likes(self):
        return self.participants.all().count()

    @property
    def remain(self):
        book = self.participants.all().count()
        total = self.max_participants - book
        return total

    @property
    def location(self):
        return str(self.city) + ', ' + str(self.state)

    @property
    def ago(self):
        now = datetime.datetime.now(datetime.timezone.utc)
        diff = now - self.created_at

        if diff.days == 0 and diff.seconds < 60:
            return str(diff.seconds) + " seconds ago" if diff.seconds != 1 else "1 second ago"
        if diff.days == 0 and diff.seconds < 3600:
            minutes = math.floor(diff.seconds / 60)
            return str(minutes) + " minutes ago" if minutes != 1 else "1 minute ago"
        if diff.days == 0 and diff.seconds < 86400:
            hours = math.floor(diff.seconds / 3600)
            return str(hours) + " hours ago" if hours != 1 else "1 hour ago"
        if diff.days < 30:
            return str(diff.days) + " days ago" if diff.days != 1 else "1 day ago"
        if diff.days < 365:
            months = math.floor(diff.days / 30)
            return str(months) + " months ago" if months != 1 else "1 month ago"
        years = math.floor(diff.days / 365)
        return str(years) + " years ago" if years != 1 else "1 year ago"

# New Travel Buddy Model
class TravelBuddy(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    availability = models.CharField(max_length=255)  # E.g., available, busy, etc.
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.location} to {self.destination}"

# New UserProfile Model for Interests
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    interests = models.TextField(blank=True)  # A comma-separated list of interests

    def __str__(self):
        return self.user.username

# Signal to Create/Update UserProfile Automatically
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.profile.save()
