from django.urls import path
from django.shortcuts import render
from . import views


urlpatterns = [
    path('', views.RecipeView.as_view(), name='about')
]