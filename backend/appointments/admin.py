from django.contrib import admin
from .models import (
    Department, Doctor, Patient, Appointment,
    Service, ContactMessage, HospitalInfo, Payment
)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['name', 'specialization', 'qualification', 'experience_years', 'is_available', 'created_at']
    list_filter = ['specialization', 'is_available', 'created_at']
    search_fields = ['name', 'specialization__name', 'qualification']


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['name', 'age', 'gender', 'phone', 'email', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['name', 'email', 'phone']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = [
        'patient', 'doctor', 'department', 'appointment_date',
        'appointment_time', 'status', 'created_at'
    ]
    list_filter = ['status', 'appointment_date', 'doctor', 'department']
    search_fields = ['patient__name', 'doctor__name', 'reason']
    date_hierarchy = 'appointment_date'


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']


@admin.register(HospitalInfo)
class HospitalInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'appointment', 'amount', 'payment_method', 'status', 'payment_date']
    list_filter = ['status', 'payment_method', 'payment_date']
    search_fields = ['transaction_id', 'appointment__patient__name']
