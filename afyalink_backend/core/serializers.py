from django.contrib.auth.models import User, Group
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
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'groups']

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=['Patient', 'Practitioner', 'Facility Admin'])
    facility_code = serializers.CharField(required=False, allow_blank=True)

    def create(self, validated_data):
        name = validated_data['name']
        email = validated_data['email']
        password = validated_data['password']
        role = validated_data['role']
        facility_code = validated_data.get('facility_code')

        username = email
        first, *rest = name.split(' ')
        last = ' '.join(rest) if rest else ''
        user = User.objects.create_user(username=username, email=email, password=password, first_name=first, last_name=last)
        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)

        facility = None
        if facility_code:
            facility = Facility.objects.filter(code=facility_code).first()
            if not facility:
                facility = Facility.objects.create(name=f'Facility {facility_code}', code=facility_code)

        if role == 'Patient':
            if not facility:
                raise serializers.ValidationError('Facility is required for Patient')
            PatientProfile.objects.create(user=user, facility=facility)
        elif role == 'Practitioner':
            if not facility:
                raise serializers.ValidationError('Facility is required for Practitioner')
            PractitionerProfile.objects.create(user=user, facility=facility)

        return user
