from django.db import models
from django.contrib.auth.models import User, Group

class Facility(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='facility_created')

    def __str__(self):
        return self.name

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='patients')
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='patient_created')

    def __str__(self):
        return f'Patient {self.user.get_full_name() or self.user.username}'

class PractitionerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='practitioner_profile')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='practitioners')
    specialty = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='practitioner_created')

    def __str__(self):
        return f'Practitioner {self.user.get_full_name() or self.user.username}'

class ChronicCondition(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='conditions')
    name = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='condition_created')

class MedicalRecord(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='records')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='records')
    assessment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='record_created')

class Diagnosis(models.Model):
    record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='diagnoses')
    name = models.CharField(max_length=255)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='diagnosis_created')

class Medication(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='medication_created')

class Prescription(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='prescriptions')
    medication = models.ForeignKey(Medication, on_delete=models.CASCADE)
    dosage = models.CharField(max_length=255)
    instructions = models.TextField(blank=True)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='prescription_created')

class Appointment(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateTimeField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='appointment_created')

class Reminder(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='reminders')
    type = models.CharField(max_length=50, choices=[('FOLLOW_UP', 'Follow-up'), ('REFILL', 'Refill'), ('MONITOR', 'Monitor')])
    due_date = models.DateField()
    message = models.CharField(max_length=255)
    is_sent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='reminder_created')

class VitalsLog(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='vitals')
    bp_systolic = models.IntegerField(null=True, blank=True)
    bp_diastolic = models.IntegerField(null=True, blank=True)
    sugar = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='vitals_created')

# Create your models here.
