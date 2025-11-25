from rest_framework import routers
from .views import GroupViewSet, MemberViewSet, ExpenseViewSet
from django.urls import path, include

router = routers.DefaultRouter()
router.register('groups', GroupViewSet)
router.register('members', MemberViewSet)
router.register('expenses', ExpenseViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
