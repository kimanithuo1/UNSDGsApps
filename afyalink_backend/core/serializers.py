"""
core/serializers.py — AFYALINK
Bugs fixed vs previous version:
  1. Duplicate email → was IntegrityError (500), now clean 400 with message
  2. Location → facility code collision → was IntegrityError (500), now uses UUID suffix
  3. Patient can register with NO facility (facility field now nullable in model)
  4. Practitioner/Admin created as is_active=False → must be approved by admin
  5. Error from create() now surfaces cleanly
"""
import uuid
from django.contrib.auth.models import User, Group
from django.db import IntegrityError
from rest_framework import serializers
from .models import Facility, PatientProfile, PractitionerProfile


class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = ['id', 'name', 'code', 'address']


class UserSerializer(serializers.ModelSerializer):
    groups = serializers.SlugRelatedField(slug_field='name', many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'groups', 'is_active']


class RegisterSerializer(serializers.Serializer):
    name          = serializers.CharField(max_length=255)
    email         = serializers.EmailField()
    password      = serializers.CharField(write_only=True, min_length=8)
    role          = serializers.ChoiceField(choices=['Patient', 'Practitioner', 'Facility Admin'])
    phone         = serializers.CharField(required=False, allow_blank=True, default='')
    location      = serializers.CharField(required=False, allow_blank=True, default='')
    facility_code = serializers.CharField(required=False, allow_blank=True, default='')
    id_number     = serializers.CharField(required=False, allow_blank=True, default='')

    def validate_email(self, value):
        """
        Catch duplicate email BEFORE hitting the database.
        Previously this reached User.objects.create_user() which raised
        IntegrityError → Django returned a 500 with no useful message.
        Now returns a clean 400.
        """
        email = value.lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                'An account with this email already exists. '
                'Please sign in or reset your password.'
            )
        return email

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError('Password must be at least 8 characters.')
        return value

    def _normalise_phone(self, phone):
        """0712345678 / +254712345678 → 254712345678"""
        p = phone.strip().replace(' ', '').replace('-', '')
        if p.startswith('+'):
            p = p[1:]
        if p.startswith('0') and len(p) == 10:
            p = '254' + p[1:]
        return p

    def _resolve_facility(self, location, facility_code):
        """
        Return a Facility or None.
        Priority: explicit facility_code > location string > None.
        Bug fixed: previously two users at 'Nairobi Clinic' generated
        the same code 'NAIROBI-CLINIC' causing IntegrityError (500).
        Fix: append 6-char UUID suffix to make code unique every time.
        """
        if facility_code:
            code = facility_code.upper().strip()
            facility = Facility.objects.filter(code=code).first()
            if facility:
                return facility
            name = location.strip() or f'Facility {code}'
            return Facility.objects.create(name=name, code=code)

        if location:
            loc = location.strip()
            existing = Facility.objects.filter(name__iexact=loc).first()
            if existing:
                return existing
            base = loc.upper().replace(' ', '-')[:40]
            suffix = uuid.uuid4().hex[:6].upper()
            return Facility.objects.create(name=loc, code=f'{base}-{suffix}')

        return None

    def create(self, validated_data):
        name          = validated_data['name'].strip()
        email         = validated_data['email']
        password      = validated_data['password']
        role          = validated_data['role']
        phone         = self._normalise_phone(validated_data.get('phone', ''))
        location      = validated_data.get('location', '').strip()
        facility_code = validated_data.get('facility_code', '').strip()
        id_number     = validated_data.get('id_number', '').strip()

        parts = name.split(' ', 1)
        first = parts[0]
        last  = parts[1] if len(parts) > 1 else ''

        # Patients active immediately; Practitioners/Admins need admin approval
        is_active = (role == 'Patient')

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first,
                last_name=last,
                is_active=is_active,
            )
        except IntegrityError:
            raise serializers.ValidationError(
                'An account with this email already exists. '
                'Please sign in or reset your password.'
            )

        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)

        facility = self._resolve_facility(location, facility_code)

        try:
            if role == 'Patient':
                PatientProfile.objects.create(
                    user=user,
                    facility=facility,      # nullable — OK if None
                    phone=phone,
                    id_number=id_number,
                )
            elif role == 'Practitioner':
                if not facility:
                    user.delete()
                    raise serializers.ValidationError(
                        'Please enter your clinic or hospital name so we can link '
                        'you to the correct facility on AFYALINK.'
                    )
                PractitionerProfile.objects.create(
                    user=user,
                    facility=facility,
                    phone=phone,
                    is_approved=False,      # admin approves before login works
                )
            # Facility Admin: no profile model; admin panel manages them
        except serializers.ValidationError:
            raise
        except Exception as exc:
            user.delete()
            raise serializers.ValidationError(f'Account setup failed: {exc}')

        return user