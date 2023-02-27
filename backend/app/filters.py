from django_filters import FilterSet
from .models import StatusHistory


class StatusHistoryFilter(FilterSet):
    class Meta:
        model = StatusHistory
        fields = ['user', 'status', 'order', 'user__username']
