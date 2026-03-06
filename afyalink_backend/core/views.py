"""
core/views.py — AFYALINK
Bugs fixed:
  1. AppointmentView defined TWICE — second (GET-only) overwrote first (POST-only)
     → POST /api/appointments/ returned 405. Fixed: single class with get() + post().
  2. RegisterView used raise_exception=True → DRF returned cryptic 400 format frontend couldn't parse.
     Fixed: explicit error extraction returning {'detail': 'human message'}.
  3. Added PendingUsersView for admin to activate/deactivate practitioner accounts.
  4. PatientPhoneUpdateView now accessible by the patient themselves, not just admin.
"""
from datetime import datetime

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Appointment, Facility, MedicalRecord,
    Medication, PatientProfile, Prescription, Reminder,
)
from .permissions import IsFacilityAdmin, IsPractitioner
from .serializers import RegisterSerializer, UserSerializer
from .sms import (
    send_appointment_reminder,
    send_bulk_sms,
    send_medication_reminder,
    send_sms,
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            first_msg = None
            for field_errors in serializer.errors.values():
                for err in field_errors:
                    first_msg = str(err)
                    break
                if first_msg:
                    break
            return Response(
                {'detail': first_msg or 'Registration failed. Please check your details.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            user = serializer.save()
        except Exception as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ContactView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        name    = request.data.get('name', '').strip()
        email   = request.data.get('email', '').strip()
        subject = request.data.get('subject', '').strip()
        message = request.data.get('message', '').strip()
        if not name or not email or not message:
            return Response({'detail': 'Name, email and message are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            send_mail(
                f'AFYALINK Contact: {subject or "General"} — {name}',
                f'From: {name} <{email}>\n\n{message}',
                settings.DEFAULT_FROM_EMAIL,
                [settings.CONTACT_EMAIL_TO],
                fail_silently=False,
            )
            return Response({'detail': 'Message sent'})
        except Exception:
            return Response({'detail': 'Failed to send. Email us at jtechbyteinsights@gmail.com'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReminderList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'patient_profile', None)
        if not profile:
            return Response([])
        reminders = Reminder.objects.filter(patient=profile).order_by('due_date')
        return Response([
            {'id': r.id, 'type': r.type, 'due_date': r.due_date, 'message': r.message, 'is_sent': r.is_sent}
            for r in reminders
        ])

    def post(self, request):
        patient_id = request.data.get('patient') or request.data.get('patient_id')
        rtype      = request.data.get('type', 'FOLLOW_UP')
        due_date   = request.data.get('due_date')
        message    = request.data.get('message', '').strip()
        if not patient_id or not due_date or not message:
            return Response({'detail': 'patient, due_date and message are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            patient = PatientProfile.objects.select_related('user').get(id=patient_id)
        except PatientProfile.DoesNotExist:
            return Response({'detail': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)
        reminder = Reminder.objects.create(patient=patient, type=rtype, due_date=due_date, message=message, is_sent=False, created_by=request.user)
        sms_sent = False
        if patient.phone:
            name = patient.user.get_full_name() or patient.user.username
            result = send_sms(patient.phone, message.replace('{name}', name))
            if result.get('success'):
                reminder.is_sent = True
                reminder.save(update_fields=['is_sent'])
                sms_sent = True
        return Response({'id': reminder.id, 'is_sent': reminder.is_sent, 'sms_sent': sms_sent}, status=status.HTTP_201_CREATED)


class BroadcastReminderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        audience = request.data.get('audience', 'all')
        message  = request.data.get('message', '').strip()
        if not message:
            return Response({'detail': 'Message is required.'}, status=status.HTTP_400_BAD_REQUEST)
        patients = PatientProfile.objects.select_related('user').all()
        if audience == 'chronic':
            patients = patients.filter(conditions__isnull=False).distinct()
        personalised = '{name}' in message
        sent = total = 0
        if personalised:
            for p in patients:
                if not p.phone:
                    continue
                total += 1
                name = p.user.get_full_name() or p.user.username or 'Patient'
                if send_sms(p.phone, message.replace('{name}', name)).get('success'):
                    sent += 1
        else:
            numbers = [p.phone for p in patients if p.phone]
            total = len(numbers)
            if numbers:
                sent = send_bulk_sms(numbers, message).get('sent', 0)
        return Response({'success': sent > 0, 'sent': sent, 'total': total})


# ────────────────────────────────────────────────────────────────────────────
# FIXED: AppointmentView was defined TWICE in the previous file.
# The second definition (GET only) silently overwrote the first (POST only).
# Effect: POST /api/appointments/ → 405 Method Not Allowed.
# Fix: one class with both get() and post().
# ────────────────────────────────────────────────────────────────────────────
class AppointmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'patient_profile', None)
        if not profile:
            return Response([])
        appts = Appointment.objects.filter(patient=profile).select_related('facility').order_by('date')
        return Response([
            {'id': a.id, 'date': a.date, 'notes': a.notes, 'facility': {'name': a.facility.name} if a.facility else None}
            for a in appts
        ])

    def post(self, request):
        patient_id = request.data.get('patient') or request.data.get('patient_id')
        date_str   = request.data.get('date')
        notes      = request.data.get('notes', '')

        if not patient_id:
            return Response({'detail': 'patient is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not date_str:
            return Response({'detail': 'date is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            patient = PatientProfile.objects.select_related('user', 'facility').get(id=patient_id)
        except PatientProfile.DoesNotExist:
            return Response({'detail': f'No patient found with ID {patient_id}. Use Search Patient to find the correct ID.'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({'detail': f'"{patient_id}" is not a valid patient ID. Use the Search Patient tool to find the correct numeric ID.'}, status=status.HTTP_400_BAD_REQUEST)

        # ── ROOT CAUSE OF 500 ─────────────────────────────────────────────
        # patient.facility is NULL for self-registered patients.
        # Old DB schema had Appointment.facility as NOT NULL → IntegrityError.
        # Fix: models.py now has null=True on Appointment.facility.
        # If the migration hasn't been applied yet, the except block below catches it
        # and returns a helpful message instead of an HTML 500 page.
        try:
            appt = Appointment.objects.create(
                patient=patient,
                facility=patient.facility,   # may be None — allowed by updated model
                date=date_str,
                notes=notes,
                created_by=request.user,
            )
        except Exception as exc:
            return Response(
                {'detail': f'Could not save appointment: {exc}. '
                           'If this is a database error, run: python manage.py makemigrations && python manage.py migrate'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        sms_sent = False
        if patient.phone:
            name = patient.user.get_full_name() or patient.user.username
            facility_name = patient.facility.name if patient.facility else 'your clinic'
            try:
                date_human = datetime.fromisoformat(str(date_str)).strftime('%a %d %b %Y at %I:%M %p')
            except Exception:
                date_human = str(date_str)
            sms_sent = send_appointment_reminder(patient.phone, name, date_human, facility_name).get('success', False)

        return Response({'id': appt.id, 'sms_sent': sms_sent}, status=status.HTTP_201_CREATED)


class PrescriptionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'patient_profile', None)
        if not profile:
            return Response([])
        qs = Prescription.objects.filter(patient=profile).select_related('medication', 'facility').order_by('-created_at')
        return Response([
            {'id': p.id, 'medication': {'name': p.medication.name} if p.medication else None, 'dosage': p.dosage, 'instructions': p.instructions, 'created_at': p.created_at, 'facility': {'name': p.facility.name} if p.facility else None}
            for p in qs
        ])

    def post(self, request):
        patient_id      = request.data.get('patient') or request.data.get('patient_id')
        medication_name = request.data.get('medication_name', '').strip()
        dosage          = request.data.get('dosage', '').strip()
        instructions    = request.data.get('instructions', '')
        frequency       = request.data.get('frequency', 'twice_daily')
        duration_days   = request.data.get('duration_days')
        with_food       = request.data.get('with_food', 'with')

        if not patient_id or not medication_name or not dosage:
            return Response({'detail': 'patient, medication_name and dosage are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            patient = PatientProfile.objects.select_related('user', 'facility').get(id=patient_id)
        except (PatientProfile.DoesNotExist, ValueError):
            return Response({'detail': f'Patient "{patient_id}" not found.'}, status=status.HTTP_404_NOT_FOUND)

        med, _ = Medication.objects.get_or_create(name=medication_name)

        # Build duration_days safely
        dur = None
        if duration_days is not None:
            try:
                dur = int(duration_days)
            except (ValueError, TypeError):
                dur = None

        presc = Prescription.objects.create(
            patient=patient,
            medication=med,
            dosage=dosage,
            frequency=frequency,
            duration_days=dur,
            with_food=with_food,
            instructions=instructions,
            facility=patient.facility,
            created_by=request.user,
        )

        # Send SMS with full dosage schedule
        if patient.phone:
            name = patient.user.get_full_name() or patient.user.username
            # Use the generated instruction string if provided, otherwise build a simple one
            sms_body = instructions or f'Hi {name}, you have been prescribed {medication_name} {dosage}. {instructions or "Take as directed by your doctor."} — AFYALINK'
            send_sms(patient.phone, sms_body[:320])   # SMSLeopard max ~320 chars for 2 SMS

        return Response({'id': presc.id}, status=status.HTTP_201_CREATED)


class FacilityListView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), IsFacilityAdmin()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        return Response([{'id': f.id, 'name': f.name, 'code': f.code, 'address': f.address} for f in Facility.objects.all().order_by('name')])

    def post(self, request):
        name = request.data.get('name', '').strip()
        code = request.data.get('code', '').strip().upper()
        address = request.data.get('address', '').strip()
        if not name or not code:
            return Response({'detail': 'Name and code are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if Facility.objects.filter(code=code).exists():
            return Response({'detail': f'Facility code {code} already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        f = Facility.objects.create(name=name, code=code, address=address, created_by=request.user)
        return Response({'id': f.id, 'name': f.name, 'code': f.code}, status=status.HTTP_201_CREATED)


class UserListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsFacilityAdmin]

    def get(self, request):
        search      = request.query_params.get('search', '').strip()
        role_filter = request.query_params.get('role', '').strip()
        users = User.objects.prefetch_related('groups').all()
        if search:
            users = users.filter(first_name__icontains=search) | users.filter(last_name__icontains=search) | users.filter(email__icontains=search) | users.filter(username__icontains=search)
        if role_filter:
            users = users.filter(groups__name=role_filter)
        return Response([UserSerializer(u).data for u in users.distinct()[:100]])


class PendingUsersView(APIView):
    """Admin: list and activate/deactivate user accounts."""
    permission_classes = [permissions.IsAuthenticated, IsFacilityAdmin]

    def get(self, request):
        role = request.query_params.get('role', 'Practitioner')
        users = User.objects.filter(groups__name=role).prefetch_related('groups')
        data = []
        for u in users:
            profile = getattr(u, 'practitioner_profile', None) or getattr(u, 'patient_profile', None)
            data.append({
                'id': u.id,
                'name': u.get_full_name() or u.username,
                'email': u.email,
                'is_active': u.is_active,
                'role': role,
                'facility': profile.facility.name if (profile and profile.facility) else '—',
                'date_joined': u.date_joined,
            })
        return Response(data)

    def post(self, request):
        user_id = request.data.get('user_id')
        action  = request.data.get('action', 'activate')
        try:
            target = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        target.is_active = (action == 'activate')
        target.save(update_fields=['is_active'])
        profile = getattr(target, 'practitioner_profile', None) or getattr(target, 'patient_profile', None)
        phone = getattr(profile, 'phone', '') or ''
        if phone and action == 'activate':
            send_sms(phone, f'Hello {target.first_name or "there"}, your AFYALINK account has been activated. You can now log in. — AFYALINK')
        label = 'activated' if target.is_active else 'deactivated'
        return Response({'detail': f'{target.email} has been {label}.'})


class PatientSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPractitioner]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        qs = PatientProfile.objects.select_related('user', 'facility').all()
        if search:
            qs = qs.filter(user__first_name__icontains=search) | qs.filter(user__last_name__icontains=search) | qs.filter(user__email__icontains=search) | qs.filter(user__username__icontains=search)
        return Response([
            {'id': p.id, 'user': {'first_name': p.user.first_name, 'last_name': p.user.last_name, 'username': p.user.username, 'email': p.user.email}, 'phone': p.phone, 'facility': {'name': p.facility.name if p.facility else ''}}
            for p in qs.distinct()[:50]
        ])


class PatientPhoneUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        patient_id = request.data.get('patient_id')
        phone      = request.data.get('phone', '').strip()
        if not patient_id or not phone:
            return Response({'detail': 'patient_id and phone are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            profile = PatientProfile.objects.get(id=patient_id)
        except PatientProfile.DoesNotExist:
            return Response({'detail': 'Patient not found.'}, status=status.HTTP_404_NOT_FOUND)
        is_own   = (request.user == profile.user)
        is_staff = request.user.groups.filter(name__in=['Facility Admin', 'Practitioner']).exists()
        if not is_own and not is_staff:
            return Response({'detail': 'Not authorised.'}, status=status.HTTP_403_FORBIDDEN)
        profile.phone = phone
        profile.save(update_fields=['phone'])
        return Response({'detail': 'Phone updated.', 'phone': profile.phone})


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
        return Response([
            {'id': r.id, 'assessment': r.assessment, 'created_at': r.created_at, 'facility': {'name': r.facility.name} if r.facility else None, 'diagnoses': [{'id': d.id, 'name': d.name, 'details': d.details} for d in r.diagnoses.all()]}
            for r in records
        ])

    def post(self, request):
        patient_id  = request.data.get('patient')
        assessment  = request.data.get('assessment', '').strip()
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