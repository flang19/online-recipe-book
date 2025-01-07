from django.shortcuts import render
from django.shortcuts import render
from django.views import View


class ContactView(View):
    def get(self, request):
        render(request, 'contact/contact.html')

