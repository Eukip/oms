from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, status_actions, LoginAPI, UserViewSet, BranchViewSet, RefreshTokenView, StatusHistoryView

router = DefaultRouter()
router.register('orders', OrderViewSet)
router.register('branches', BranchViewSet)
router.register('users', UserViewSet)

urlpatterns = [
    path('users/login/', LoginAPI.as_view()),
    path('', include(router.urls)),
    path('token/refresh/', RefreshTokenView.as_view()),
    path('statuses/', status_actions),
    path('status/history/', StatusHistoryView.as_view()),
]
