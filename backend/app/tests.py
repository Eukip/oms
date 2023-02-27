from django.test import TestCase
from django.conf import settings
from websocket import create_connection
from django.test import TestCase
from channels.testing import HttpCommunicator
from .consumers import OrderConsumer
import jwt
import json

from django.test import TestCase
from channels.testing import HttpCommunicator
from app.consumers import OrderConsumer
from channels.db import database_sync_to_async
import requests
import asyncio, json, os
from .models import Order
from .serializers import OrderSerializer
# print('TEST CONNECTION')
# ws = create_connection('ws://localhost:8000/api/updates/')
# ws.send(
#     json.dumps({
#         'type': 'create',
#         'data': {
#             'city': 2
#         }
#     })
# )
#
# res = ws.recv()
# print('Response: ', type(res))
# ws.close()
#
# d = {"type":"create","data":{"city":2}}


# {"type":"update","data":{"id":7,"status":10}}

# {"type":"update","data":{"id":7,"status":3,"firstname":"Akbar"}}

print(os.getenv('SECRET_ADMIN_URL'))

