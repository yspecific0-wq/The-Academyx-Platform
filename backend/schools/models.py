# schools/models.py

from django.db import models

class School(models.Model):
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.name
