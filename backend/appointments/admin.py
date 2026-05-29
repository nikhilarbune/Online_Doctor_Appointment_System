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
    readonly_fields = ['created_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'image', 'specialization', 'phone', 'email')
        }),
        ('Qualifications & Experience', {
            'fields': ('qualification', 'experience_years', 'bio')
        }),
        ('Availability', {
            'fields': ('available_days', 'available_time', 'is_available')
        }),
        ('Consultation', {
            'fields': ('consultation_fee',)
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    actions = ['make_available', 'make_unavailable']

    def make_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'{updated} doctor(s) marked as available.')
    make_available.short_description = "✅ Mark as Available"

    def make_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'{updated} doctor(s) marked as unavailable.')
    make_unavailable.short_description = "❌ Mark as Unavailable"


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['name', 'age', 'gender', 'phone', 'email', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['name', 'email', 'phone']
    readonly_fields = ['created_at', 'updated_at', 'user']
    fieldsets = (
        ('Personal Information', {
            'fields': ('user', 'name', 'age', 'gender', 'phone', 'email')
        }),
        ('Medical Information', {
            'fields': ('blood_group', 'address', 'medical_history')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = [
        'patient', 'doctor', 'department', 'appointment_date',
        'appointment_time', 'status', 'created_at'
    ]
    list_filter = ['status', 'doctor', 'department', 'created_at']
    search_fields = ['patient__name', 'doctor__name', 'reason']
    date_hierarchy = 'appointment_date'
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Patient & Doctor', {
            'fields': ('patient', 'doctor', 'department')
        }),
        ('Appointment Details', {
            'fields': ('appointment_date', 'appointment_time', 'reason', 'status')
        }),
        ('Medical Information', {
            'fields': ('notes', 'prescription'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['confirm_appointment', 'reject_appointment', 'cancel_appointment']

    def confirm_appointment(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} appointment(s) confirmed.')
    confirm_appointment.short_description = "Mark selected appointments as Confirmed"

    def reject_appointment(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} appointment(s) rejected.')
    reject_appointment.short_description = "Mark selected appointments as Rejected"

    def cancel_appointment(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} appointment(s) cancelled.')
    cancel_appointment.short_description = "Mark selected appointments as Cancelled"


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
    list_display = ['name', 'phone', 'email', 'emergency_number']
    fieldsets = (
        ('Hospital Details', {
            'fields': ('name', 'tagline', 'logo')
        }),
        ('Contact Information', {
            'fields': ('phone', 'email', 'address', 'emergency_number')
        }),
        ('Social Media', {
            'fields': ('facebook', 'twitter', 'instagram', 'linkedin'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'appointment', 'amount', 'payment_method', 'status', 'payment_date']
    list_filter = ['status', 'payment_method', 'payment_date']
    search_fields = ['transaction_id', 'appointment__patient__name']
    readonly_fields = ['payment_date', 'updated_at', 'transaction_id']
    fieldsets = (
        ('Appointment & Amount', {
            'fields': ('appointment', 'amount')
        }),
        ('Payment Details', {
            'fields': ('payment_method', 'status', 'transaction_id')
        }),
        ('Timestamps', {
            'fields': ('payment_date', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    actions = ['mark_as_completed', 'mark_as_failed']

    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} payment(s) marked as completed.')
    mark_as_completed.short_description = "✅ Mark selected as Completed"

    def mark_as_failed(self, request, queryset):
        updated = queryset.update(status='failed')
        self.message_user(request, f'{updated} payment(s) marked as failed.')
    mark_as_failed.short_description = "❌ Mark selected as Failed"
