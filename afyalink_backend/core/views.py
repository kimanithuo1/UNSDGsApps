from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer
from .models import Reminder
from django.core.mail import send_mail
from django.conf import settings

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

class ReminderList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'patient_profile', None)
        if not profile:
            return Response([], status=status.HTTP_200_OK)
        reminders = Reminder.objects.filter(patient=profile).order_by('due_date')
        data = [
            {
                'id': r.id,
                'type': r.type,
                'due_date': r.due_date,
                'message': r.message,
                'is_sent': r.is_sent,
            }
            for r in reminders
        ]
        return Response(data)

class ContactView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name = request.data.get('name', '').strip()
        email = request.data.get('email', '').strip()
        message = request.data.get('message', '').strip()

        if not name or not email or not message:
            return Response({'detail': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

        subject = f'AFYALINK Contact from {name}'
        body = f'From: {name} <{email}>\n\nMessage:\n{message}'

        try:
            send_mail(
                subject,
                body,
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL_TO],
                fail_silently=False,
            )
            return Response({'detail': 'Message sent'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': 'Failed to send message'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
