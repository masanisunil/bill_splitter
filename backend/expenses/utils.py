from django.core.mail import send_mail
from django.conf import settings

def notify_admin(subject, message):
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [settings.ADMIN_EMAIL],
            fail_silently=True,
        )
    except Exception as e:
        print("Email Error:", e)
