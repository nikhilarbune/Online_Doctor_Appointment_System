from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from appointments.views import (
    DepartmentViewSet, DoctorViewSet, PatientViewSet,
    AppointmentViewSet, ServiceViewSet, ContactMessageViewSet,
    HospitalInfoViewSet, AuthViewSet, PaymentViewSet
)

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'contact-messages', ContactMessageViewSet)
router.register(r'hospital-info', HospitalInfoViewSet)
router.register(r'payments', PaymentViewSet)

# Auth routes (non-standard)
auth_urls = [
    path('register/', AuthViewSet.as_view({'post': 'register'})),
    path('login/', AuthViewSet.as_view({'post': 'login'})),
    path('logout/', AuthViewSet.as_view({'post': 'logout'}), name='logout'),
    path('me/', AuthViewSet.as_view({'get': 'me'}), name='me'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include(auth_urls)),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
