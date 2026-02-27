from rest_framework.permissions import BasePermission

class IsPractitioner(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='Practitioner').exists()

class IsFacilityAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='Facility Admin').exists()

class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.groups.filter(name='Patient').exists()
