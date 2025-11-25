# from rest_framework import viewsets
# from .models import Group, Member, Expense
# from .serializers import GroupSerializer, MemberSerializer, ExpenseSerializer
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django.db.models import Sum

# class GroupViewSet(viewsets.ModelViewSet):
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer

#     @action(detail=True, methods=['get'])
#     def summary(self, request, pk=None):
#         group = self.get_object()

#         # get all members
#         members = list(group.members.all())

#         # total expenses
#         total = group.expenses.aggregate(total=Sum('amount'))['total'] or 0

#         # equal split
#         per_person = total / len(members) if members else 0

#         balances = []
#         for m in members:
#             paid = group.expenses.filter(paid_by=m).aggregate(sum=Sum('amount'))['sum'] or 0
#             balance = paid - per_person
#             balances.append({
#                 'member_id': m.id,
#                 'name': m.name,
#                 'paid': paid,
#                 'share': per_person,
#                 'balance': balance
#             })

#         return Response({
#             'total': total,
#             'per_person': per_person,
#             'balances': balances
#         })
    
#     @action(detail=True, methods=['get'])
#     def settlement(self, request, pk=None):
#         group = self.get_object()
#         members = list(group.members.all())

#         # Calculate balances
#         total = group.expenses.aggregate(total=Sum('amount'))['total'] or 0
#         per_person = total / len(members) if members else 0

#         balances = []
#         for m in members:
#             paid = group.expenses.filter(paid_by=m).aggregate(sum=Sum('amount'))['sum'] or 0
#             balance = paid - per_person
#             balances.append({
#                 'id': m.id,
#                 'name': m.name,
#                 'balance': balance
#             })

#         # Separate creditors (+) & debtors (-)
#         creditors = [b.copy() for b in balances if b['balance'] > 0]
#         debtors = [b.copy() for b in balances if b['balance'] < 0]

#         for d in debtors:
#             d['balance'] = -d['balance']  # make positive for calculation

#         i = j = 0
#         settlements = []

#         # Greedy match
#         while i < len(debtors) and j < len(creditors):
#             amount = min(debtors[i]['balance'], creditors[j]['balance'])

#             settlements.append({
#                 "from": debtors[i]["name"],
#                 "to": creditors[j]["name"],
#                 "amount": amount
#             })

#             debtors[i]['balance'] -= amount
#             creditors[j]['balance'] -= amount

#             if debtors[i]['balance'] == 0:
#                 i += 1
#             if creditors[j]['balance'] == 0:
#                 j += 1

#         return Response({"settlements": settlements})
    
#     @action(detail=True, methods=['get'])
#     def expenses(self, request, pk=None):
#         group = self.get_object()
#         exps = group.expenses.all()
#         serializer = ExpenseSerializer(exps, many=True)
#         return Response(serializer.data)



# class MemberViewSet(viewsets.ModelViewSet):
#     queryset = Member.objects.all()
#     serializer_class = MemberSerializer

# class ExpenseViewSet(viewsets.ModelViewSet):
#     queryset = Expense.objects.all()
#     serializer_class = ExpenseSerializer


from rest_framework import viewsets
from .models import Group, Member, Expense
from .serializers import GroupSerializer, MemberSerializer, ExpenseSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum

# EMAIL IMPORTS
from django.core.mail import send_mail
from django.conf import settings


# 🔔 Helper function (email sender)
def notify_admin(subject, message):
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [settings.ADMIN_EMAIL],
            fail_silently=True
        )
    except:
        pass



class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    # 🔔 Notify on group created
    def perform_create(self, serializer):
        group = serializer.save()
        notify_admin(
            "New Group Created",
            f"Group created: {group.name}"
        )

    # 🔔 Notify on group updated
    def perform_update(self, serializer):
        group = serializer.save()
        notify_admin(
            "Group Updated",
            f"Group updated: {group.name}"
        )

    # 🔔 Notify on group deleted
    def perform_destroy(self, instance):
        notify_admin(
            "Group Deleted",
            f"Group deleted: {instance.name}"
        )
        instance.delete()



    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        group = self.get_object()

        members = list(group.members.all())
        total = group.expenses.aggregate(total=Sum('amount'))['total'] or 0
        per_person = total / len(members) if members else 0

        balances = []
        for m in members:
            paid = group.expenses.filter(paid_by=m).aggregate(sum=Sum('amount'))['sum'] or 0
            balance = paid - per_person
            balances.append({
                'member_id': m.id,
                'name': m.name,
                'paid': paid,
                'share': per_person,
                'balance': balance
            })

        return Response({
            'total': total,
            'per_person': per_person,
            'balances': balances
        })


    @action(detail=True, methods=['get'])
    def settlement(self, request, pk=None):
        group = self.get_object()
        members = list(group.members.all())

        total = group.expenses.aggregate(total=Sum('amount'))['total'] or 0
        per_person = total / len(members) if members else 0

        balances = []
        for m in members:
            paid = group.expenses.filter(paid_by=m).aggregate(sum=Sum('amount'))['sum'] or 0
            balance = paid - per_person
            balances.append({
                'id': m.id,
                'name': m.name,
                'balance': balance
            })

        creditors = [b.copy() for b in balances if b['balance'] > 0]
        debtors = [b.copy() for b in balances if b['balance'] < 0]

        for d in debtors:
            d['balance'] = -d['balance']

        settlements = []
        i = j = 0

        while i < len(debtors) and j < len(creditors):
            amount = min(debtors[i]['balance'], creditors[j]['balance'])

            settlements.append({
                "from": debtors[i]["name"],
                "to": creditors[j]["name"],
                "amount": amount
            })

            debtors[i]['balance'] -= amount
            creditors[j]['balance'] -= amount

            if debtors[i]['balance'] == 0:
                i += 1
            if creditors[j]['balance'] == 0:
                j += 1

        return Response({"settlements": settlements})


    @action(detail=True, methods=['get'])
    def expenses(self, request, pk=None):
        group = self.get_object()
        exps = group.expenses.all()
        serializer = ExpenseSerializer(exps, many=True)
        return Response(serializer.data)



class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

    # 🔔 Notify when member added
    def perform_create(self, serializer):
        member = serializer.save()
        notify_admin(
            "New Member Added",
            f"Member '{member.name}' added to group {member.group.name}"
        )



class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    # 🔔 Notify when expense created
    def perform_create(self, serializer):
        expense = serializer.save()
        notify_admin(
            "Expense Added",
            f"Expense '{expense.title}' of ₹{expense.amount} added to group {expense.group.name}"
        )

    # 🔔 Notify when expense updated
    def perform_update(self, serializer):
        expense = serializer.save()
        notify_admin(
            "Expense Updated",
            f"Expense '{expense.title}' updated in group {expense.group.name}"
        )

    # 🔔 Notify when expense deleted
    def perform_destroy(self, instance):
        notify_admin(
            "Expense Deleted",
            f"Expense '{instance.title}' deleted from group {instance.group.name}"
        )
        instance.delete()
