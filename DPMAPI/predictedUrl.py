from django.conf.urls import url
from DPM.DPMAPI import views

urlpatterns = [
    url('', views.predicted),
    url('Predicted/', views.predicted)
]
