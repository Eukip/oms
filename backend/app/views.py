from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import viewsets, permissions, status, generics, pagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django_fsm import TransitionNotAllowed
from django_filters import rest_framework as filters

from .models import Order, Branch, User, StatusHistory
from .permissions import IsAdmin, BranchPermission
from .serializers import OrderSerializer, LoginSerializer, UserSerializer, BranchSerializer, RefreshTokenSerializer, StatusHistorySerializer
from .utils import ACTIONS
from .filters import StatusHistoryFilter


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = Order.objects.all()
    parser_classes = (MultiPartParser,)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)("orders", {"type": "send.new.order",
                                                           "data": serializer.data})
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        # TODO Save history who opened the order
        user = self.request.user
        obj = self.get_object()
        delivery_status = request.GET.get('status', None)
        if delivery_status:
            print(f'Delivery status request : {delivery_status}')
            try:
                if delivery_status == 'delivery_complete':
                    obj.delivery_succeeded()
                elif delivery_status == 'delivery_cancel':
                    obj.delivery_rejected()
                elif delivery_status == 'delivery_rejection':
                    obj.delivery_returned()

                obj.save()
            except TransitionNotAllowed as e:
                print(e)
                return Response({'detail': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)("orders", {"type": "send.updated.order",
                                                                   "data": {
                                                                       'type': 'update_success',
                                                                       'data': self.get_serializer(obj).data}
                                                                   })

        return super().retrieve(request, *args, **kwargs)


class LoginAPI(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny, )


class RefreshTokenView(TokenRefreshView):
    serializer_class = RefreshTokenSerializer


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAdmin,)
    queryset = User.objects.all()


class BranchViewSet(viewsets.ModelViewSet):
    serializer_class = BranchSerializer
    permission_classes = (BranchPermission,)
    queryset = Branch.objects.all()


class StatusHistoryView(generics.ListAPIView):
    serializer_class = StatusHistorySerializer
    queryset = StatusHistory.objects.all()
    pagination_class = pagination.PageNumberPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = StatusHistoryFilter


@api_view()
@permission_classes([permissions.AllowAny])
def status_actions(request):
    return Response(ACTIONS)
