
from django.contrib import admin
from django.conf.urls import url
from django.views.generic.base import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework import routers
from DPMAPI import views

# router = routers.DefaultRouter()
# router.register(r'Centroid', views.centroids)
# router.register(r'Predicted', views.predicted)

urlpatterns = [
    url('admin/', admin.site.urls),
    path('Centroids',include('DPMAPI.urls')),
    path('Predicted',include('DPMAPI.predictedUrl')),
    url('', TemplateView.as_view(template_name="index.html"), name="index")
]
