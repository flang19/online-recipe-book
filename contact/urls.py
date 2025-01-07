from django.urls import include
from . import views


urlpatterns = [
    path('', views.ContactView.as_view(), name='contact')
]
