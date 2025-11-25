from django.contrib import admin
from expenses.models import Group,Member,Expense
# Register your models here.


admin.site.register(Group)
admin.site.register(Member)
admin.site.register(Expense)
