from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer
from .models import Reminder

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
