from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView, ReminderList, ContactView, BroadcastReminderView, AppointmentView, PrescriptionView, FacilityListView, UserListView, PatientSearchView, MedicalRecordView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('reminders/', ReminderList.as_view(), name='reminders'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('reminders/broadcast/', BroadcastReminderView.as_view(), name='broadcast_reminders'),
    path('appointments/', AppointmentView.as_view(), name='appointments'),
    path('prescriptions/', PrescriptionView.as_view(), name='prescriptions'),
    path('facilities/', FacilityListView.as_view(), name='facilities'),
    path('users/', UserListView.as_view(), name='users'),
    path('patients/', PatientSearchView.as_view(), name='patients'),
    path('records/', MedicalRecordView.as_view(), name='records'),
]
