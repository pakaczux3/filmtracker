from django.db import models
from django.contrib.auth.models import User

class Movie(models.Model):
    STATUS_CHOICES = [
        ('to_watch', 'Do obejrzenia'),
        ('watched', 'Obejrzany'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='to_watch')
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    review = models.TextField(blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"
