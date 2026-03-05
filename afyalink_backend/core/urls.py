"""core/urls.py"""
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, MeView,
    ContactView,
    ReminderList, BroadcastReminderView,
    AppointmentView,
    PrescriptionView,
    FacilityListView,
    UserListView, PendingUsersView,
    PatientSearchView, PatientPhoneUpdateView,
    MedicalRecordView,
)

urlpatterns = [
    path('auth/login/',    TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/',  TokenRefreshView.as_view(),    name='token_refresh'),
    path('auth/register/', RegisterView.as_view(),        name='register'),
    path('auth/me/',       MeView.as_view(),              name='me'),

    path('contact/',             ContactView.as_view(),         name='contact'),

    path('reminders/',           ReminderList.as_view(),        name='reminders'),
    path('reminders/broadcast/', BroadcastReminderView.as_view(), name='broadcast_reminders'),

    path('appointments/',        AppointmentView.as_view(),     name='appointments'),
    path('prescriptions/',       PrescriptionView.as_view(),    name='prescriptions'),

    path('facilities/',          FacilityListView.as_view(),    name='facilities'),
    path('users/',               UserListView.as_view(),        name='users'),
    path('users/pending/',       PendingUsersView.as_view(),    name='pending_users'),

    path('patients/',            PatientSearchView.as_view(),      name='patients'),
    path('patients/phone/',      PatientPhoneUpdateView.as_view(), name='patient_phone'),
    path('records/',             MedicalRecordView.as_view(),      name='records'),
]