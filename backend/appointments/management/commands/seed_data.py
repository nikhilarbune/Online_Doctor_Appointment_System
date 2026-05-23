from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from appointments.models import (
    Department, Doctor, Patient, Appointment,
    Service, HospitalInfo
)
from datetime import date, time


class Command(BaseCommand):
    help = 'Seed the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@jupiterhospital.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write('Created admin user (admin/admin123)')

        # Create hospital info
        if not HospitalInfo.objects.exists():
            HospitalInfo.objects.create(
                name='Jupiter Hospital',
                tagline='Your Health, Our Priority - World Class Healthcare',
                phone='+91-1234567890',
                email='info@jupiterhospital.com',
                address='123 Health Street, Medical District, New Delhi, India 110001',
                emergency_number='108',
            )
            self.stdout.write('Created hospital info')

        # Create departments
        departments_data = [
            {'name': 'Cardiology', 'description': 'Heart care and cardiovascular treatments'},
            {'name': 'Neurology', 'description': 'Brain and nervous system treatments'},
            {'name': 'Orthopedics', 'description': 'Bone, joint, and muscle treatments'},
            {'name': 'Pediatrics', 'description': 'Child healthcare and vaccinations'},
            {'name': 'Gynecology', 'description': 'Women\'s health and maternity care'},
            {'name': 'Dermatology', 'description': 'Skin, hair, and nail treatments'},
            {'name': 'Ophthalmology', 'description': 'Eye care and vision treatments'},
            {'name': 'ENT', 'description': 'Ear, nose, and throat treatments'},
            {'name': 'Dental', 'description': 'Dental care and oral health'},
            {'name': 'General Medicine', 'description': 'Primary healthcare and consultations'},
        ]

        departments = {}
        for dept in departments_data:
            department, _ = Department.objects.get_or_create(
                name=dept['name'],
                defaults={'description': dept['description']}
            )
            departments[dept['name']] = department

        self.stdout.write(f'Created {len(departments)} departments')

        # Create doctors
        doctors_data = [
            {'name': 'Rajesh Kumar', 'dept': 'Cardiology', 'qualification': 'MBBS, MD, DM (Cardiology)', 'experience': 15, 'fee': 1500},
            {'name': 'Priya Sharma', 'dept': 'Neurology', 'qualification': 'MBBS, MD, DM (Neurology)', 'experience': 12, 'fee': 1400},
            {'name': 'Amit Patel', 'dept': 'Orthopedics', 'qualification': 'MBBS, MS (Ortho)', 'experience': 10, 'fee': 1200},
            {'name': 'Sneha Reddy', 'dept': 'Pediatrics', 'qualification': 'MBBS, MD (Pediatrics)', 'experience': 8, 'fee': 1000},
            {'name': 'Meera Iyer', 'dept': 'Gynecology', 'qualification': 'MBBS, MD, DGO', 'experience': 14, 'fee': 1300},
            {'name': 'Vikram Singh', 'dept': 'Dermatology', 'qualification': 'MBBS, MD (Dermatology)', 'experience': 9, 'fee': 1100},
            {'name': 'Anita Desai', 'dept': 'Ophthalmology', 'qualification': 'MBBS, MS (Ophthalmology)', 'experience': 11, 'fee': 1000},
            {'name': 'Suresh Menon', 'dept': 'ENT', 'qualification': 'MBBS, MS (ENT)', 'experience': 13, 'fee': 1100},
            {'name': 'Kavita Joshi', 'dept': 'Dental', 'qualification': 'BDS, MDS', 'experience': 7, 'fee': 800},
            {'name': 'Ramesh Gupta', 'dept': 'General Medicine', 'qualification': 'MBBS, MD', 'experience': 20, 'fee': 900},
        ]

        for doc in doctors_data:
            Doctor.objects.get_or_create(
                name=doc['name'],
                defaults={
                    'specialization': departments[doc['dept']],
                    'qualification': doc['qualification'],
                    'experience_years': doc['experience'],
                    'phone': f'+91-999999{len(doctors_data):02d}',
                    'email': f"{doc['name'].lower().replace(' ', '.')}@jupiterhospital.com",
                    'consultation_fee': doc['fee'],
                    'available_days': 'Mon,Wed,Fri' if doc['experience'] > 10 else 'Tue,Thu,Sat',
                    'available_time': '9:00 AM - 2:00 PM' if doc['experience'] > 10 else '3:00 PM - 8:00 PM',
                    'is_available': True,
                    'bio': f"Dr. {doc['name']} is a renowned specialist in {doc['dept']} with {doc['experience']} years of experience."
                }
            )

        self.stdout.write(f'Created {len(doctors_data)} doctors')

        # Create services
        services_data = [
            {'name': '24/7 Emergency', 'description': 'Round the clock emergency services', 'icon': 'emergency'},
            {'name': 'Online Consultation', 'description': 'Video consultations with expert doctors', 'icon': 'video'},
            {'name': 'Health Checkups', 'description': 'Comprehensive health screening packages', 'icon': 'checkup'},
            {'name': 'Diagnostic Lab', 'description': 'Advanced pathology and diagnostics', 'icon': 'lab'},
            {'name': 'Pharmacy', 'description': 'In-house pharmacy with home delivery', 'icon': 'pharmacy'},
            {'name': 'Ambulance Service', 'description': 'Quick response ambulance service', 'icon': 'ambulance'},
        ]

        for svc in services_data:
            Service.objects.get_or_create(
                name=svc['name'],
                defaults={
                    'description': svc['description'],
                    'icon': svc['icon'],
                    'is_active': True
                }
            )

        self.stdout.write(f'Created {len(services_data)} services')

        # Create sample patients
        patients_data = [
            {'name': 'John Doe', 'age': 35, 'gender': 'Male', 'phone': '+91-9876543210', 'email': 'john@example.com'},
            {'name': 'Jane Smith', 'age': 28, 'gender': 'Female', 'phone': '+91-9876543211', 'email': 'jane@example.com'},
            {'name': 'Michael Brown', 'age': 45, 'gender': 'Male', 'phone': '+91-9876543212', 'email': 'michael@example.com'},
        ]

        patients = []
        for pat in patients_data:
            patient, _ = Patient.objects.get_or_create(
                email=pat['email'],
                defaults=pat
            )
            patients.append(patient)

        self.stdout.write(f'Created {len(patients_data)} patients')

        # Create sample appointments
        doctors_list = list(Doctor.objects.all())[:3]
        for i, patient in enumerate(patients):
            Appointment.objects.get_or_create(
                patient=patient,
                doctor=doctors_list[i % len(doctors_list)],
                defaults={
                    'appointment_date': date.today(),
                    'appointment_time': time(10, 0),
                    'reason': 'Regular health checkup',
                    'status': 'confirmed' if i == 0 else 'pending',
                }
            )

        self.stdout.write('Created sample appointments')
        self.stdout.write(self.style.SUCCESS('Database seeding completed successfully!'))
