from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import (
    Department, Doctor, Patient, Appointment,
    Service, ContactMessage, HospitalInfo, Payment
)
from .serializers import (
    DepartmentSerializer, DoctorSerializer,
    PatientSerializer, AppointmentSerializer,
    ServiceSerializer, ContactMessageSerializer,
    HospitalInfoSerializer, AppointmentCreateSerializer,
    UserRegistrationSerializer, LoginSerializer,
    PaymentSerializer, PaymentCreateSerializer,
    UserSerializer
)


class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create patient profile
            Patient.objects.create(
                user=user,
                name=f"{user.first_name} {user.last_name}",
                email=user.email,
                age=30,
                gender='Other',
                phone=request.data.get('phone', '')
            )
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': UserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                })
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        user = request.user
        try:
            patient = Patient.objects.get(user=user)
            patient_data = PatientSerializer(patient).data
        except Patient.DoesNotExist:
            patient_data = None
        return Response({
            'user': UserSerializer(user).data,
            'patient': patient_data
        })


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().prefetch_related('doctors')
    serializer_class = DepartmentSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all().select_related('specialization')
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'specialization__name', 'qualification']
    ordering_fields = ['name', 'experience_years', 'consultation_fee']

    @action(detail=False, methods=['get'])
    def available(self, request):
        available_doctors = self.get_queryset().filter(is_available=True)
        serializer = self.get_serializer(available_doctors, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_department(self, request):
        department_id = request.query_params.get('department_id')
        if department_id:
            doctors = self.get_queryset().filter(specialization_id=department_id)
            serializer = self.get_serializer(doctors, many=True)
            return Response(serializer.data)
        return Response([])


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email', 'phone']

    def get_queryset(self):
        return Patient.objects.filter(user=self.request.user)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().select_related(
        'patient', 'doctor', 'department'
    ).order_by('-appointment_date', '-appointment_time')
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status', 'doctor', 'patient', 'appointment_date']
    ordering_fields = ['appointment_date', 'appointment_time', 'created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        return AppointmentSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            try:
                patient = Patient.objects.get(user=self.request.user)
                return Appointment.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return Appointment.objects.none()
        return Appointment.objects.none()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_appointments(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            appointments = Appointment.objects.filter(patient=patient).order_by('-appointment_date')
            serializer = self.get_serializer(appointments, many=True)
            return Response(serializer.data)
        except Patient.DoesNotExist:
            return Response([])

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        return Response({'status': 'Appointment confirmed'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'rejected'
        appointment.save()
        return Response({'status': 'Appointment rejected'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'status': 'Appointment cancelled'})

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.notes = request.data.get('notes', '')
        appointment.prescription = request.data.get('prescription', '')
        appointment.save()
        return Response({'status': 'Appointment completed'})


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().select_related('appointment')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        return PaymentSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            try:
                patient = Patient.objects.get(user=self.request.user)
                return Payment.objects.filter(appointment__patient=patient)
            except Patient.DoesNotExist:
                return Payment.objects.none()
        return Payment.objects.none()

    @action(detail=True, methods=['post'])
    def process(self, request, pk=None):
        payment = self.get_object()
        payment.status = 'completed'
        payment.transaction_id = f"TXN{payment.id}{request.user.id}"
        payment.save()
        return Response({'status': 'Payment completed', 'transaction_id': payment.transaction_id})


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def submit(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Your message has been sent successfully!'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HospitalInfoViewSet(viewsets.ModelViewSet):
    queryset = HospitalInfo.objects.all()
    serializer_class = HospitalInfoSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def general(self, request):
        info = self.get_queryset().first()
        if info:
            serializer = self.get_serializer(info)
            return Response(serializer.data)
        return Response({})
