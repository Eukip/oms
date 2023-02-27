from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from jwt import decode as jwt_decode
from .utils import logger

User = get_user_model()


@database_sync_to_async
def get_user(decoded_data):
    try:
        user = User.objects.get(id=decoded_data["user_id"])
    except User.DoesNotExist:
        return AnonymousUser
    else:
        return user


class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]
        try:
            # This will automatically validate the token and
            # raise an error if token is invalid
            UntypedToken(token)
        except (InvalidToken, TokenError):
            logger.info('Invalid token')
            return None
        else:
            decoded_data = jwt_decode(token, settings.SECRET_KEY,
                                      algorithms=["HS256"])
            logger.info(f'Decoded data {decoded_data}')
        scope['user'] = await get_user(decoded_data)

        return await self.app(scope, receive, send)
