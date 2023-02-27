from django.conf.urls import url
from .consumers import OrderConsumer

ws_urlpatterns = [
    url(r'updates/$', OrderConsumer.as_asgi()),
]
