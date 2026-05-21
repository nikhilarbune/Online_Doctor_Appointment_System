from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import (
    Department, Doctor, Patient, Appointment,
    Service, ContactMessage, HospitalInfo, Payment
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)


class DepartmentSerializer(serializers.ModelSerializer):
    doctors_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'image', 'doctors_count', 'created_at']
        read_only_fields = ['created_at']

    def get_doctors_count(self, obj):
        return obj.doctors.count()


class DoctorSerializer(serializers.ModelSerializer):
    specialization_name = serializers.CharField(source='specialization.name', read_only=True)
    availability_status = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = [
            'id', 'name', 'specialization', 'specialization_name',
            'qualification', 'experience_years', 'bio', 'image',
            'phone', 'email', 'consultation_fee', 'available_days',
            'available_time', 'is_available', 'availability_status', 'created_at'
        ]
        read_only_fields = ['created_at']

    def get_availability_status(self, obj):
        if obj.is_available:
            return "Available"
        return "Not Available"


class PatientSerializer(serializers.ModelSerializer):
    user_details = UserSerializer(source='user', read_only=True)

    class Meta:
        model = Patient
        fields = [
            'id', 'user', 'user_details', 'name', 'age', 'gender',
            'phone', 'email', 'address', 'blood_group',
            'medical_history', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.specialization.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    has_payment = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'doctor_specialization', 'department', 'department_name',
            'appointment_date', 'appointment_time', 'reason', 'status',
            'notes', 'prescription', 'created_at', 'updated_at', 'has_payment'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_has_payment(self, obj):
        return hasattr(obj, 'payment') and obj.payment.status == 'completed'

    def validate(self, data):
        doctor = data.get('doctor')
        appointment_date = data.get('appointment_date')

        if doctor and appointment_date:
            if not doctor.is_available:
                raise serializers.ValidationError("Doctor is not available")

            existing = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                appointment_time=data.get('appointment_time'),
                status__in=['pending', 'confirmed']
            )
            if existing.exists():
                raise serializers.ValidationError("This time slot is already booked")

        return data


class AppointmentCreateSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(write_only=True)
    patient_age = serializers.IntegerField(write_only=True)
    patient_gender = serializers.CharField(write_only=True)
    patient_phone = serializers.CharField(write_only=True)
    patient_email = serializers.EmailField(write_only=True)
    payment_method = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Appointment
        fields = [
            'id', 'doctor', 'department', 'appointment_date', 'appointment_time',
            'reason', 'patient_name', 'patient_age', 'patient_gender',
            'patient_phone', 'patient_email', 'payment_method'
        ]

    def create(self, validated_data):
        patient_data = {
            'name': validated_data.pop('patient_name'),
            'age': validated_data.pop('patient_age'),
            'gender': validated_data.pop('patient_gender'),
            'phone': validated_data.pop('patient_phone'),
            'email': validated_data.pop('patient_email'),
        }
        payment_method = validated_data.pop('payment_method', None)

        user = self.context['request'].user if self.context.get('request') else None

        if user and user.is_authenticated:
            try:
                patient = Patient.objects.get(user=user)
                for key, value in patient_data.items():
                    setattr(patient, key, value)
                patient.save()
            except Patient.DoesNotExist:
                patient = Patient.objects.create(user=user, **patient_data)
        else:
            patient, created = Patient.objects.get_or_create(
                email=patient_data['email'],
                defaults=patient_data
            )
            if not created:
                for key, value in patient_data.items():
                    setattr(patient, key, value)
                patient.save()

        if 'department' not in validated_data:
            validated_data['department'] = validated_data['doctor'].specialization

        appointment = Appointment.objects.create(patient=patient, **validated_data)

        if payment_method:
            Payment.objects.create(
                appointment=appointment,
                amount=validated_data['doctor'].consultation_fee,
                payment_method=payment_method,
                status='pending',
                transaction_id=f"TXN{appointment.id}{int(appointment.created_at.timestamp())}"
            )

        return appointment


class PaymentSerializer(serializers.ModelSerializer):
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'appointment', 'appointment_details', 'amount',
            'payment_method', 'transaction_id', 'status', 'payment_date', 'updated_at'
        ]
        read_only_fields = ['payment_date', 'updated_at']


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['amount', 'payment_method']

    def create(self, validated_data):
        appointment_id = self.context['view'].kwargs.get('appointment_pk')
        appointment = Appointment.objects.get(pk=appointment_id)

        payment = Payment.objects.create(
            appointment=appointment,
            **validated_data,
            transaction_id=f"TXN{appointment.id}{payment.pk}" if appointment else ""
        )
        return payment


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'icon', 'image', 'is_active', 'created_at']
        read_only_fields = ['created_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'is_read', 'created_at']
        read_only_fields = ['is_read', 'created_at']


class HospitalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = HospitalInfo
        fields = '__all__'
