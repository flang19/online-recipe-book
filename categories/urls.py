from django.urls import path
from django.shortcuts import render
from . import views

urlpatterns = [
    path('', views.CategoryView.as_view(), name='categories')
]