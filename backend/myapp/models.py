from django.db import models
from django.contrib.auth.models import User
class News(models.Model):
    CATEGORY_CHOICES = [
        ('General', 'General'),
        ('Technology', 'Technology'),
        ('Sports', 'Sports'),
        ('Health', 'Health'),
        ('Politics', 'Politics'),
        ('Local News', 'Local News'),
        ('World News', 'World News'),
    ]
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=255)
    content = models.TextField()
    publication_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='news_images/', null=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    author_name = models.CharField(max_length=100) 
    author_image = models.ImageField(upload_to='author_images/', null=True, blank=True)
    time = models.CharField(max_length=50) 
    place = models.CharField(max_length=100) 
    class Meta:
        verbose_name = 'News'
        verbose_name_plural = 'News'
        ordering = ['-publication_date']
    def __str__(self):
        return f"{self.title} - {self.get_category_display()}"
class Advertisement(models.Model):
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=255)
    content = models.TextField()
    publication_date = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='ads_images/', null=True, blank=True)
    class Meta:
        verbose_name = 'Advertisement'
        verbose_name_plural = 'Advertisements'
        ordering = ['-publication_date']
    def __str__(self):
        return self.title
