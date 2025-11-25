from rest_framework import viewsets
from .models import Group, Member, Expense
from .serializers import GroupSerializer, MemberSerializer, ExpenseSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    @action(detail=True, methods=['get'])
    def summary(self, request, pk=None):
        group = self.get_object()

        # get all members
        members = list(group.members.all())

        # total expenses
        total = group.expenses.aggregate(total=Sum('amount'))['total'] or 0

        # equal split
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

        # Calculate balances
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

        # Separate creditors (+) & debtors (-)
        creditors = [b.copy() for b in balances if b['balance'] > 0]
        debtors = [b.copy() for b in balances if b['balance'] < 0]

        for d in debtors:
            d['balance'] = -d['balance']  # make positive for calculation

        i = j = 0
        settlements = []

        # Greedy match
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

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

