from rest_framework import permissions
from app.utils import ADMIN


class IsAdmin(permissions.BasePermission):
    message = 'Вам не разрешено выполнять эту операцию'

    def has_permission(self, request, view):
        user = request.user
        if user.is_anonymous:
            return False
        return bool(user.role == ADMIN or user.is_staff)


class BranchPermission(permissions.BasePermission):
    message = 'Вам не разрешено выполнять эту операцию'

    def has_permission(self, request, view):
        user = request.user
        if user.is_authenticated and request.method in permissions.SAFE_METHODS:
            return True
        return bool(user.role == ADMIN or user.is_staff)
