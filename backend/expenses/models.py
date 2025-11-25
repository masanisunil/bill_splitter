from django.db import models

# Create your models here.

class Group(models.Model):
    name=models.CharField(max_length=200)
    created_at=models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Member(models.Model):
    group=models.ForeignKey(Group,related_name='members',on_delete=models.CASCADE)
    name=models.CharField(max_length=200)


    def __str__(self):
        return f"{self.name} ({self.group.name})"
    

class Expense(models.Model):
    group=models.ForeignKey(Group,related_name='expenses',on_delete=models.CASCADE)
    title=models.CharField(max_length=200)
    amount=models.FloatField()
    paid_by=models.ForeignKey(Member,related_name='paid_expenses',on_delete=models.CASCADE)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.amount}"



