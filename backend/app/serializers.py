import jwt
from django.conf import settings
from django.contrib.auth.models import update_last_login
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

from .models import Order, User, Branch, StatusHistory
from .utils import PROCESSING, RETURNED, REJECTED


class OrderSerializer(serializers.ModelSerializer):
    status_text = serializers.ReadOnlyField(source='get_status_display')
    processing_by = serializers.SerializerMethodField()
    image_front_url = serializers.SerializerMethodField()
    image_back_url = serializers.SerializerMethodField()
    returned = serializers.SerializerMethodField()
    cancelled = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['status', 'return_reason']

    @staticmethod
    def get_returned(instance):
        return instance.histories.filter(status=RETURNED).exists()

    @staticmethod
    def get_cancelled(instance):
        return instance.histories.filter(status=REJECTED).exists()

    @staticmethod
    def get_image_front_url(instance):
        photo_url = instance.image_front.url
        return 'http://0.0.0.0:8000' + photo_url

    @staticmethod
    def get_image_back_url(instance):
        photo_url = instance.image_back.url
        return 'http://0.0.0.0:8000' + photo_url

    def get_processing_by(self, instance):
        # try:
        #     # TODO here must be get by pk
        #     history = StatusHistory.objects.filter(order=instance, status=instance.status).last()
        # except StatusHistory.DoesNotExist:
        #     return None
        # else:
        #     if history.status == PROCESSING:
        #         return history.user_id
        #     else:
        #         return None
        history = StatusHistory.objects.filter(order=instance, status=instance.status).last()
        if history:
            if history.user:
                fullname = f'{history.user.first_name} {history.user.last_name}'
            else:
                fullname = 'Unknown user'
            return {'id': history.user_id,
                    'fullname': fullname}
        else:
            request = self.context.get('request', None)
            if request:
                user = request.user
                if user.is_authenticated:
                    return {"id": user.id,
                            "fullname": f'{user.first_name} {user.last_name}'}
                return {}
            return {}


class UserSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField()
    role_text = serializers.ReadOnlyField(source='get_role_display')
    branch_text = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'role', 'email', 'id', 'branch',
                  'role_text', 'fullname', 'branch_text')
        read_only_fields = ('id',)
        extra_kwargs = {
            'password': {'write_only': True}
        }

    @staticmethod
    def get_fullname(instance):
        return f"{instance.first_name} {instance.last_name}"

    @staticmethod
    def get_branch_text(instance):
        if instance.branch:
            return f"г.{instance.branch.city}, {instance.branch.address}"

        return 'No branch'

    def create(self, validated_data):

        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()

        return user


class RefreshTokenSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user_id = jwt.decode(data['access'], settings.SECRET_KEY, algorithms='HS256').get('user_id', None)
        user = User.objects.get(id=user_id)
        if user:
            data['user'] = UserSerializer(user).data

        return data


class LoginSerializer(TokenObtainPairSerializer, serializers.ModelSerializer):
    default_error_messages = {
        'no_active_account': 'Wrong password',
        'no_user': 'User does not exist'
    }

    def validate(self, attrs):
        username = attrs.get('username')
        try:
            User.objects.get(username=username)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                self.error_messages['no_user']
            )
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['user'] = UserSerializer(self.user).data

        update_last_login(None, self.user)

        return data

    class Meta:
        model = User
        fields = ('username', 'password')


class BranchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Branch
        fields = '__all__'


class StatusHistorySerializer(serializers.ModelSerializer):
    status_text = serializers.ReadOnlyField(source='get_status_display')
    order_text = serializers.SerializerMethodField()
    user_text = serializers.SerializerMethodField()

    class Meta:
        model = StatusHistory
        fields = '__all__'
        extra_fields = ('status_text', 'user_text', 'order_text')

    @staticmethod
    def get_user_text(obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    @staticmethod
    def get_order_text(obj):
        return f"{obj.order.firstname} {obj.order.lastname} {obj.order.inn}"