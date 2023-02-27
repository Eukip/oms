from .base import *

DEBUG = True

ALLOWED_HOSTS = ['0.0.0.0', '0.0.0.0:8000', '0.0.0.0:3000', 'http://0.0.0.0:3000', 'host.docker.internal:8000',
                 'host.docker.internal',
                 'http://localhost:3000', 'localhost:3000', 'localhost',
                 'http://localhost:5000', 'http://3bb224954eaf.ngrok.io', 'https://3bb224954eaf.ngrok.io',
                 '3bb224954eaf.ngrok.io', '165.227.135.127']

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
    'http://0.0.0.0:3000',
    'http://localhost:5000',
    'http://host.docker.internal:8000'
)

LOGGING_HANDLERS = ['console']
