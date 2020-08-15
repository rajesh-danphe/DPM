from django.conf.urls import url
from DPM.DPMAPI import views

urlpatterns = [
    url('', views.centroids),
    url('Centroids/', views.centroids)
]
