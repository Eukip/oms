from channels.exceptions import InvalidChannelLayerError, AcceptConnection, DenyConnection
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django_fsm import TransitionNotAllowed, InvalidResultState
import requests
from . import serializers
from .models import Order, StatusHistory
from .utils import (SPECIALIST, OPERATOR,
                    NEW, PROCESSING, RETURNED, CONFIRMED,
                    PRINTED, SEND, REJECTED,
                    DELIVERY_REJECTED, DELIVERY_DONE, DELIVERY_ACCEPTED, DELIVERY_RETURNED,
                    SMARTPOST_API_URL,
                    )
from .utils import logger


class OrderConsumer(AsyncJsonWebsocketConsumer):
    groups = ['orders']

    async def websocket_connect(self, message):
        """
        Called when a WebSocket connection is opened.
        """
        user = self.scope['user']
        logger.info(f'User : {user.username}')
        if not user.is_anonymous:
            try:
                for group in self.groups:
                    await self.channel_layer.group_add(group, self.channel_name)
            except AttributeError:
                raise InvalidChannelLayerError(
                    "BACKEND is unconfigured or doesn't support groups"
                )
            try:
                await self.connect()
            except AcceptConnection:
                await self.accept()
            except DenyConnection:
                await self.close()

        else:
            logger.exception('Unauthenticated user')
            await self.accept()
            await self.send_json({'detail': 'Unauthenticated user'})
            await self.close()

    async def connect(self):
        await self.accept()
        await self.send_orders()
        print('Connected!')

    async def disconnect(self, code):
        pass

    async def receive_json(self, content, **kwargs):
        """
        Receive new order creation request or
        Receive order status update request
        content: Json data of the form :
        {
            'type': Type of the request, update or create new order,
            'data': Order data to be created or updated
        }
        """
        logger.info(f'Received data: {content}')
        await self.send_json({'receive': 'success'})
        request_type = content.get('type', None)
        if not request_type:
            await self.send_json({
                'type': 'request_fail',
                'detail': 'Missing request type. Send of the requests [`create`, `update`, `orders_list`]'
            })

        else:
            if request_type == 'update':
                order = content.get('data')
                update_response = await self.update_order(order)
                # Return update response to connected users
                await self.channel_layer.group_send(
                    'orders',
                    {
                        'type': 'send.updated.order',
                        'data': update_response,
                    }
                )

            elif request_type == 'create':
                order = content.get('data')
                logger.info(f'Type {type(order)}')
                create_response = await self.create_order(order)
                await self.channel_layer.group_send(
                    'orders',
                    {
                        'type': 'send.new.order',
                        'data': create_response,
                    }
                )

            elif request_type == 'orders_list':
                await self.channel_layer.group_send(
                    'orders',
                    {
                        'type': 'send.orders',
                    }
                )

    async def send_orders(self, event=None):
        orders = await self.orders_list()

        await self.send_json({'type': 'orders_list', 'data': orders})

    async def send_new_order(self, data):
        await self.send_json({'type': 'create_success', 'data': data['data']})

    async def send_updated_order(self, data):
        await self.send_json(data['data'])

    @database_sync_to_async
    def create_order_history(self):
        pass

    @database_sync_to_async
    def create_order(self, data):
        logger.info('In create order')
        serializer = serializers.OrderSerializer(data=data)
        if not serializer.is_valid():
            return {
                'type': 'create_fail',
                'data': data,
                'detail': str(serializer.errors)
            }

        serializer.save()
        return {
            'type': 'create_success',
            'data': data,
        }

    @database_sync_to_async
    def orders_list(self):
        user = self.scope['user']
        queryset = Order.objects.all().order_by('-created_at')
        # if user.role == OPERATOR:
        #     queryset = queryset.filter(status__in=[NEW, RETURNED, PROCESSING, CONFIRMED])
        # elif user.role == SPECIALIST:
        #     queryset = queryset.filter(status__in=[CONFIRMED, PRINTED, SEND])
        serializer = serializers.OrderSerializer(queryset, many=True)
        return serializer.data

    @database_sync_to_async
    def update_order(self, data):
        """
        data: json data of the form
        {
            'id': Id of the order to be updated,
            'status': Status of the order to be updated to
            'return_reason': Reason of the return if order is returned by call center or specialist
        }
        """

        logger.info(f'Data to be updated: {data} of type {type(data)}')
        target = data.get('status', None)
        if target is None:
            return {'type': 'update_fail',
                    'data': {
                        'id': data['id']
                    },
                    'detail': 'Target status is missing'}

        order = Order.objects.get(pk=data['id'])
        try:
            if target == DELIVERY_ACCEPTED:
                logger.info('Target delivery')
                data = {
                    'login': 'Optima',
                    'password': "#-5R%N\-~m-y}bV%Gs'6!4z54Y{$+3tw",
                    'description': 'Optima visa card',
                    'address_from': 'Test',
                    'address_to': 'Test',
                    'city_from': "",
                    "city_to": "",
                    'receiver_name': f'{order.firstname} {order.lastname}',
                    'receiver_phone': order.phone,
                    'customer_amount': 0,
                    'partner_order_id': order.id
                }
                r = requests.post(SMARTPOST_API_URL, data=data)
                logger.info(f"Response code : {r.status_code}")
                if not r.ok:
                    logger.exception(r.status_code)
                    return {'type': 'update_fail',
                            'data': serializers.OrderSerializer(order).data,
                            'detail': 'Служба доставки временно не доступен'
                            }

            if target == NEW:
                order.cancel_process()
            elif target == PROCESSING:
                order.processed_by_cc()
            elif target == REJECTED:
                order.rejected_by_cc()
            elif target == CONFIRMED:
                order.confirmed_by_cc()
                pk = data['id']
                order_data = data.get('order', {})
                for key in ['id', 'status', 'status_text', 'processing_by', 'image_front', 'image_front_url', 'image_back',
                            'image_back_url', 'returned', 'created_at', 'updated_at', 'created_at']:
                    order_data.pop(key, None)

                Order.objects.filter(pk=pk).update(**order_data)
                order = Order.objects.get(pk=pk)
            elif target == RETURNED:
                order.returned_by_specialist()
            elif target == SEND:
                order.send_to_print()
            elif target == PRINTED:
                order.printed()
            elif target == DELIVERY_ACCEPTED:
                order.delivery_accepted()
            elif target == DELIVERY_REJECTED:
                order.delivery_rejected()
            elif target == DELIVERY_RETURNED:
                order.delivery_returned()
            elif target == DELIVERY_DONE:
                order.delivery_succeeded()
            else:
                return {'type': 'update_fail',
                        'data': serializers.OrderSerializer(order).data,
                        'detail': 'Invalid status update code. Expected: 1, 2, 3, 10, 11, 12, 20'
                        }

        except TransitionNotAllowed as e:
            return {'type': 'update_fail',
                    'data': serializers.OrderSerializer(order).data,
                    'detail': str(e)
                    }

        except InvalidResultState as e:
            return {'type': 'update_fail',
                    'data': serializers.OrderSerializer(order).data,
                    'detail': str(e)
                    }
        else:
            order.return_reason = data.get('return_reason', '')
            order.cancel_reason = data.get('cancel_reason', '')
            order.save()
            self.create_status_history(order)
            response = {
                'type': 'update_success',
                'data': serializers.OrderSerializer(order).data
            }

            return response

    def create_status_history(self, order):
        status_history = StatusHistory.objects.create(user=self.scope['user'],
                                                      order=order,
                                                      status=order.status
                                                      )

        status_history.save()
