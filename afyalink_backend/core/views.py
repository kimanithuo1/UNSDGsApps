from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from .models import Reminder, PatientProfile, Appointment, Prescription, Medication, Facility, MedicalRecord, Diagnosis
from .permissions import IsFacilityAdmin, IsPractitioner
from django.core.mail import send_mail
from django.conf import settings
from .sms import send_sms, send_bulk_sms, send_appointment_reminder, send_medication_reminder, send_followup_reminder
from datetime import datetime

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

    def post(self, request):
        patient_id = request.data.get('patient_id')
        rtype = request.data.get('type')
        due_date = request.data.get('due_date')
        message = request.data.get('message', '')
        if not patient_id or not rtype or not due_date or not message:
            return Response({'detail': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            patient = PatientProfile.objects.get(id=patient_id)
        except PatientProfile.DoesNotExist:
            return Response({'detail': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        reminder = Reminder.objects.create(
            patient=patient,
            type=rtype,
            due_date=due_date,
            message=message,
            is_sent=False,
        )
        phone = patient.phone or ''
        name = patient.user.get_full_name() or patient.user.username
        if phone:
            send_sms(phone, message)
            reminder.is_sent = True
            reminder.save()
        return Response({'id': reminder.id, 'is_sent': reminder.is_sent}, status=status.HTTP_201_CREATED)

class BroadcastReminderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        audience = request.data.get('audience', 'all')
        message = request.data.get('message', '')
        if not message:
            return Response({'detail': 'Message required'}, status=status.HTTP_400_BAD_REQUEST)
        patients = list(PatientProfile.objects.all())
        numbers = []
        personalized = False
        if '{name}' in message:
            personalized = True
        if personalized:
            sent = 0
            for p in patients:
                phone = p.phone or ''
                if not phone:
                    continue
                name = p.user.get_full_name() or p.user.username or 'Patient'
                msg = message.replace('{name}', name)
                res = send_sms(phone, msg)
                if res.get('success'):
                    sent += 1
            return Response({'success': True, 'sent': sent, 'total': len(patients)}, status=status.HTTP_200_OK)
        else:
            for p in patients:
                if p.phone:
                    numbers.append(p.phone)
            res = send_bulk_sms(numbers, message)
            return Response(res, status=status.HTTP_200_OK)

class AppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        patient_id = request.data.get('patient_id')
        date_str = request.data.get('date')
        notes = request.data.get('notes', '')
        try:
            patient = PatientProfile.objects.get(id=patient_id)
        except PatientProfile.DoesNotExist:
            return Response({'detail': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        appt = Appointment.objects.create(
            patient=patient,
            facility=patient.facility,
            date=date_str,
            notes=notes,
            created_by=request.user,
        )
        phone = patient.phone or ''
        name = patient.user.get_full_name() or patient.user.username
        facility_name = patient.facility.name
        if phone:
            try:
                d = datetime.fromisoformat(date_str)
                date_human = d.strftime('%b %d, %Y %I:%M %p')
            except Exception:
                date_human = date_str
            send_appointment_reminder(phone, name, date_human, facility_name)
        return Response({'id': appt.id}, status=status.HTTP_201_CREATED)

class PrescriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        patient_id = request.data.get('patient_id')
        medication_name = request.data.get('medication_name')
        dosage = request.data.get('dosage')
        instructions = request.data.get('instructions', '')
        if not patient_id or not medication_name or not dosage:
            return Response({'detail': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            patient = PatientProfile.objects.get(id=patient_id)
        except PatientProfile.DoesNotExist:
            return Response({'detail': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
        med, _ = Medication.objects.get_or_create(name=medication_name)
        presc = Prescription.objects.create(
            patient=patient,
            medication=med,
            dosage=dosage,
            instructions=instructions,
            facility=patient.facility,
            created_by=request.user,
        )
        phone = patient.phone or ''
        name = patient.user.get_full_name() or patient.user.username
        if phone:
            send_medication_reminder(phone, name, medication_name)
        return Response({'id': presc.id}, status=status.HTTP_201_CREATED)

    def get(self, request):
        profile = getattr(request.user, 'patient_profile', None)
        if not profile:
            return Response([])
        qs = Prescription.objects.filter(patient=profile).select_related('medication', 'facility').order_by('-created_at')
        data = [
            {
                'id': p.id,
                'medication': {'name': p.medication.name} if p.medication else None,
                'dosage': p.dosage,
                'instructions': p.instructions,
                'created_at': p.created_at,
                'facility': {'name': p.facility.name} if p.facility else None,
            }
            for p in qs
        ]
        return Response(data)

class FacilityListView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsFacilityAdmin()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        facilities = Facility.objects.all().order_by('name')
        data = [{'id': f.id, 'name': f.name, 'code': f.code, 'address': f.address} for f in facilities]
        return Response(data)

    def post(self, request):
        name = request.data.get('name', '').strip()
        code = request.data.get('code', '').strip().upper()
        address = request.data.get('address', '').strip()
        if not name or not code:
            return Response({'detail': 'Name and code are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if Facility.objects.filter(code=code).exists():
            return Response({'detail': f'Facility code {code} already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        facility = Facility.objects.create(name=name, code=code, address=address, created_by=request.user)
        return Response({'id': facility.id, 'name': facility.name, 'code': facility.code}, status=status.HTTP_201_CREATED)

class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsFacilityAdmin]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        users = User.objects.prefetch_related('groups').all()
        if search:
            users = users.filter(first_name__icontains=search) | users.filter(last_name__icontains=search) | users.filter(email__icontains=search) | users.filter(username__icontains=search)
        data = [UserSerializer(u).data for u in users.distinct()[:100]]
        return Response(data)

class PatientSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPractitioner]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        qs = PatientProfile.objects.select_related('user', 'facility').all()
        if search:
            qs = qs.filter(user__first_name__icontains=search) | qs.filter(user__last_name__icontains=search) | qs.filter(user__email__icontains=search) | qs.filter(user__username__icontains=search)
        data = []
        for p in qs.distinct()[:50]:
            data.append({
                'id': p.id,
                'user': {
                    'first_name': p.user.first_name,
                    'last_name': p.user.last_name,
                    'username': p.user.username,
                    'email': p.user.email,
                },
                'facility': {'name': p.facility.name if p.facility else ''},
            })
        return Response(data)

class PatientPhoneUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsFacilityAdmin]

    def post(self, request):
        patient_id = request.data.get('patient_id')
        phone = request.data.get('phone', '').strip()
        if not patient_id or not phone:
            return Response({'detail': 'patient_id and phone are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            profile = PatientProfile.objects.get(id=patient_id)
        except PatientProfile.DoesNotExist:
            return Response({'detail': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)
        profile.phone = phone
        profile.save(update_fields=['phone'])
        return Response({'detail': 'Phone updated.', 'patient_id': profile.id, 'phone': profile.phone}, status=status.HTTP_200_OK)

class MedicalRecordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        patient_id = request.query_params.get('patient')
        if patient_id:
            records = MedicalRecord.objects.filter(patient_id=patient_id).select_related('facility').prefetch_related('diagnoses').order_by('-created_at')
        else:
            profile = getattr(request.user, 'patient_profile', None)
            if not profile:
                return Response([])
            records = MedicalRecord.objects.filter(patient=profile).select_related('facility').prefetch_related('diagnoses').order_by('-created_at')
        data = []
        for r in records:
            data.append({
                'id': r.id,
                'assessment': r.assessment,
                'created_at': r.created_at,
                'facility': {'name': r.facility.name} if r.facility else None,
                'diagnoses': [{'id': d.id, 'name': d.name, 'details': d.details} for d in r.diagnoses.all()],
            })
        return Response(data)

    def post(self, request):
        patient_id = request.data.get('patient')
        assessment = request.data.get('assessment', '').strip()
        facility_id = request.data.get('facility')
        if not patient_id or not assessment:
            return Response({'detail': 'patient and assessment are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            patient = PatientProfile.objects.get(id=patient_id)
        except PatientProfile.DoesNotExist:
            return Response({'detail': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)
        facility = patient.facility
        if facility_id:
            try:
                facility = Facility.objects.get(id=facility_id)
            except Facility.DoesNotExist:
                pass
        record = MedicalRecord.objects.create(patient=patient, facility=facility, assessment=assessment, created_by=request.user)
        return Response({'id': record.id, 'message': 'Assessment saved.'}, status=status.HTTP_201_CREATED)

class AppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'patient_profile', None)
        if not profile:
            return Response([])
        appts = Appointment.objects.filter(patient=profile).select_related('facility').order_by('date')
        data = [{'id': a.id, 'date': a.date, 'notes': a.notes, 'facility': {'name': a.facility.name} if a.facility else None} for a in appts]
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
