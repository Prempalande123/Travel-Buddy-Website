from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LogoutView
from .views import *

urlpatterns = [
    # Event-related URLs
    path('', home, name='index'),
    path('book_unbook/<int:id>', bookevent, name='book_unbook'),
    path('add_event', addevent, name='add_event'),
    path('viewe_event/<int:id>', Single_event, name='viewe_event'),
    path('remove_event/<int:event_id>', delete_event, name='remove_event'),
    path('viewe_parti', view_parti, name='viewe_parti'),
    path('viewe_all_event', all_event, name='viewe_all_event'),
    path('confirm/<str:name>/<str:location>/<str:date>', confirm, name='confirm'),
    path('prompt/<int:id>', prompt, name='prompt'),
    path('event/search/', event_search, name='event_search'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # New Travel Buddy-related URLs
    path('create_travel_buddy/', create_travel_buddy, name='create_travel_buddy'),
    path('search_travel_buddy/', search_travel_buddy, name='search_travel_buddy'),
]
