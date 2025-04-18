from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import event, Tag, TravelBuddy, UserProfile
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.utils import timezone
from datetime import datetime
from django.contrib import messages
from django.db.models import Q
from django.core.mail import EmailMessage, send_mail
from django.template.loader import render_to_string
from django.contrib.auth.models import User
import threading
import logging


# Function to send email in a background thread
def send_email_async(subject, message, from_email, recipient_list, html_message=None):
    send_mail(subject, message, from_email, recipient_list, html_message=html_message)


# Home view
def home(request):
    events = event.objects.all().order_by('-created_at')[:10]
    return render(request, 'index.html', context={'events': events})


# Confirm event view
def confirm(request, name, location, date):
    detail = {'name': name, 'location': location, 'date': date}
    return render(request, 'index.html', context={'detail': detail})


# Prompt view
def prompt(request, id):
    even = event.objects.get(pk=id)
    detail = {'pk': even.pk, 'name': even.name, 'location': even.location, 'date': even.date}
    return render(request, 'prompt.html', context={'detail': detail})


# Book event view
@login_required
def bookevent(request, id):
    even = event.objects.get(pk=id)
    if request.user not in even.participants.all():
        even.participants.add(request.user)
        detail = {'pk': even.pk, 'name': even.name, 'location': even.location, 'date': even.date}

        # Send email notification asynchronously
        try:
            subject = "Event Booking Confirmation"
            context = {'user': request.user, 'event': even}
            message = render_to_string('emails/booking_confirmation.html', context)
            from_email = 'adityachavan3221@gmail.com'
            recipient_list = [request.user.email]

            # Start a background thread for sending email
            threading.Thread(target=send_email_async, args=(subject, '', from_email, recipient_list, message)).start()

        except Exception as e:
            logging.error(f"Failed to send email: {e}")
            messages.error(request, "Could not send confirmation email.")

        return render(request, 'confirm.html', context={'detail': detail})

    else:
        # Unbooking the event
        even.participants.remove(request.user)

        # Send unbooking email
        try:
            subject = "Event Unbooking Confirmation"
            context = {'user': request.user, 'event': even}
            message = render_to_string('emails/event_unbooked_confirmation.html', context)
            email = EmailMessage(subject, message, 'adityachavan3221@gmail.com', [request.user.email])
            email.content_subtype = "html"
            email.send()
        except Exception as e:
            logging.error(f"Failed to send unbooking email: {e}")
            messages.error(request, "Could not send unbooking email.")

        return render(request, 'unbooked.html')


# Single event view
def Single_event(request, id):
    even = event.objects.get(pk=id)
    return render(request, 'singal.html', context={'detail': even})


# Add event view
@login_required
def addevent(request):
    if request.method == 'POST':
        orgnizer = request.user
        name = request.POST.get('name')
        description = request.POST.get('description')
        city = request.POST.get('city')
        state = request.POST.get('state')
        date = request.POST.get('date')
        leave = request.POST.get('is_leave') == 'on'
        max_p = request.POST.get('max_p')
        event_type = request.POST.get('event_type')
        tags = request.POST.getlist('tags[]')

        datetime_obj = datetime.strptime(date, '%Y-%m-%d')
        timezone_obj = timezone.make_aware(datetime_obj, timezone.get_current_timezone())

        new_event = event.objects.create(
            name=name,
            description=description,
            orginzer=orgnizer,
            city=city,
            state=state,
            date=timezone_obj,
            educational_leave=leave,
            max_participants=max_p,
            event_type=event_type
        )
        new_event.tags.set(tags)

        messages.success(request, "Event created successfully!")
        return redirect('/viewe_all_event')


# Delete event view
@login_required
def delete_event(request, event_id):
    event.objects.get(pk=event_id).delete()
    messages.success(request, "Event deleted successfully!")
    return HttpResponseRedirect('/accounts/profile')


# View participants in event
@csrf_exempt
def view_parti(request):
    event_id = request.POST.get('event_id')
    even = event.objects.get(pk=event_id)
    full_response = 'No Participants' if even.num_likes == 0 else ''
    for p in even.participants.all():
        view_profile = reverse('view_user_profile', args=[p.pk])
        strres = f'<li class="list-group-item"><a href="{view_profile}" style="text-decoration: none;"><img src="{ p.profile.profilePic.url }" style="width: 30px; height: 30px; border-radius:50%;"><span class="mx-2 text-muted" style="font-size:9pt;">{p.first_name} {p.last_name}</span></a></li>'
        full_response += strres
    return JsonResponse({'status': full_response})


# View all events
def all_event(request):
    events = event.objects.all().order_by('-id')
    tags = Tag.objects.all()
    return render(request, 'events.html', context={'events': events, 'tags': tags})


# Event search view
def event_search(request):
    if request.method == 'POST':
        city = request.POST.get('city', '')
        distance = request.POST.get('distance', '')
        tags = request.POST.getlist('tags[]')

        events = event.objects.all()

        if city and distance:
            events = events.filter(Q(city__icontains=city))
        if tags:
            events = events.filter(tags__name__in=tags)

        search_results = {'events': events}
        return render(request, 'events.html', search_results)

    tags = Tag.objects.all()
    events = event.objects.all().order_by('-id')
    return render(request, 'events.html', context={'events': events, "tags": tags})


# ----------------- Travel Buddy Views -----------------

# Create or Edit Travel Buddy Profile
@login_required
def create_travel_buddy(request):
    if request.method == 'POST':
        location = request.POST.get('location')
        destination = request.POST.get('destination')
        availability = request.POST.get('availability')
        bio = request.POST.get('bio')

        buddy, created = TravelBuddy.objects.update_or_create(
            user=request.user,
            defaults={
                'location': location,
                'destination': destination,
                'availability': availability,
                'bio': bio,
            }
        )

        message = "Travel buddy profile created!" if created else "Travel buddy profile updated!"
        messages.success(request, message)
        return redirect('home')

    return render(request, 'create_travel_buddy.html')


# Search Travel Buddy
def search_travel_buddy(request):
    if request.method == 'POST':
        last_name = request.POST.get('last_name', '')
        buddies = TravelBuddy.objects.all()

        if last_name:
            users = User.objects.filter(last_name__icontains=last_name)
            buddies = buddies.filter(user__in=users)

        return render(request, 'search_travel_buddy.html', {'buddies': buddies})

    return render(request, 'search_travel_buddy.html')


# ----------------- New Travel Buddy Search Views -----------------

# Search Users by Name or Interests
def search_users(request):
    query = request.GET.get('q', '')  # Get the search query from the URL
    users = UserProfile.objects.filter(
        Q(user__username__icontains=query) |  # Match name
        Q(interests__icontains=query)  # Match interests
    ).distinct()

    return render(request, 'search.html', {'users': users, 'query': query})


# User Profile Detail View
def user_profile_detail(request, user_id):
    user_profile = get_object_or_404(UserProfile, user__id=user_id)
    return render(request, 'user_profile_detail.html', {'user_profile': user_profile})
