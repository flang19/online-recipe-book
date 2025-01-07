from django.shortcuts import render
from django.views import View


class RecipeView(View):
    def get(self, request):
        return render(request, 'recipes/recipes.html')