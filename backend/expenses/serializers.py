from rest_framework import serializers
from .models import Group,Member,Expense



class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model=Member
        fields=['id','name','group']


class ExpenseSerializer(serializers.ModelSerializer):
    paid_by=serializers.PrimaryKeyRelatedField(queryset=Member.objects.all())

    class Meta:
        model=Expense
        fields=['id','group','title','amount','paid_by','created_at']


class GroupSerializer(serializers.ModelSerializer):
    members=MemberSerializer(many=True,read_only=True)
    expenses=ExpenseSerializer(many=True,read_only=True)

    class Meta:
        model=Group
        fields=['id','name','created_at','members','expenses']
