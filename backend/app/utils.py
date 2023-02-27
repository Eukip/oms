import os
import coloredlogs
import logging

ADMIN = 1
SPECIALIST = 2
OPERATOR = 3
COURIER = 4

ROLES = (
    (ADMIN, 'Администратор'),
    (SPECIALIST, 'Специалист сектора платежных карт и эквайринга'),
    (OPERATOR, 'Оператор колл-центра'),
    (COURIER, 'Курьер'),
)

NEW = 0
PROCESSING = 1
REJECTED = 2
CONFIRMED = 3
RETURNED = 10
SEND = 11
PRINTED = 12
DELIVERY_ACCEPTED = 20
DELIVERY_REJECTED = 21
DELIVERY_RETURNED = 22
DELIVERY_DONE = 23

STATUSES = (
    (NEW, 'Новая заявка'),
    (PROCESSING, 'Заявка в обработке'),
    (REJECTED, 'Отменен'),
    (CONFIRMED, 'Заявка подтверждена '),
    (RETURNED, 'Заявка возвращена в колл-центр'),
    (SEND, 'Отправлено на выпуск'),
    (PRINTED, 'Карта напечетана, выдано на доставку'),
    (DELIVERY_ACCEPTED, 'Карта принята на доставку'),
    (DELIVERY_REJECTED, 'Доставка отменена'),
    (DELIVERY_RETURNED, 'Карта не доставлена'),
    (DELIVERY_DONE, 'Карта доставлена')
)
#
# ACTIONS = (
#     (PROCESSING, 'Взять в обработку'),
#     (REJECTED, 'Отменить'),
#     (CONFIRMED, 'Подтверждать'),
#     (REVIEWED, 'Проверить детали'),
#     (RETURNED, 'Возвратить в колл-центр'),
#     (SEND, 'Отправить на выпуск'),
#     (READY, 'Готов к печати'),
#     (PRINTED, 'Распечатать и отдать в доставку'),
#     (DELIVERY_ACCEPTED, 'Принять к доставке'),
#     (DELIVERY_REJECTED, 'Отклонить доставку'),
#     (DELIVERY_RETURNED, 'Доставка отклонена'),
#     (DELIVERY_DONE, 'Доставлено'),
# )
ACTIONS = {
    PROCESSING: 'Взять в обработку',
    REJECTED: 'Отменить',
    CONFIRMED: 'Подтверждать',
    RETURNED: 'Возвратить в колл-центр',
    SEND: 'Отправить на выпуск',
    PRINTED: 'Распечатать и отдать в доставку',
    DELIVERY_ACCEPTED: 'Принять к доставке',
    DELIVERY_REJECTED: 'Отклонить доставку',
    DELIVERY_RETURNED: 'Доставка отклонена',
    DELIVERY_DONE: 'Доставлено'
}

logger = logging.getLogger('ABC-XYZ')
coloredlogs.install(level='INFO', logger=logger)

SMARTPOST_API_URL = os.getenv('SMARTPOST_API_URL', 'http://smartpost:7000/api/v1/order/create/for/optima/')
