
from django.contrib import admin
from django.conf.urls import url
from django.views.generic.base import TemplateView
from django.urls import path, include
urlpatterns = [
    url('admin/', admin.site.urls),
    path('Centroids',include('DPMAPI.urls')),
    path('Predicted',include('DPMAPI.predictedUrl')),
    url('', TemplateView.as_view(template_name="index.html"), name="index")
]
