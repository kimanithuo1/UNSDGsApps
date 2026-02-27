from django.contrib import admin
from .models import (
    Facility, PatientProfile, PractitionerProfile, ChronicCondition, MedicalRecord,
    Diagnosis, Medication, Prescription, Appointment, Reminder, VitalsLog
)

admin.site.register(Facility)
admin.site.register(PatientProfile)
admin.site.register(PractitionerProfile)
admin.site.register(ChronicCondition)
admin.site.register(MedicalRecord)
admin.site.register(Diagnosis)
admin.site.register(Medication)
admin.site.register(Prescription)
admin.site.register(Appointment)
admin.site.register(Reminder)
admin.site.register(VitalsLog)
