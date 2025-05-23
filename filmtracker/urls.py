from django.contrib.auth.views import LoginView, LogoutView
from django.urls import path, include
from movies import views as movie_views

urlpatterns = [
    path('', movie_views.home, name='home'),
    path('login/', LoginView.as_view(template_name='movies/login.html'), name='login'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    path('api/', include('movies.urls')),
]
