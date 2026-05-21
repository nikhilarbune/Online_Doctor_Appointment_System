# Online Doctor Appointment System

A full-stack web application for booking doctor appointments online, built with Django REST Framework and React.

## Features

- **Home Page**: Hospital overview, statistics, featured departments, doctors, and services
- **Departments**: View all medical departments with doctor counts
- **Doctors**: Browse doctors with filtering by department and search functionality
- **Services**: View hospital services (24/7 Emergency, Online Consultation, etc.)
- **Book Appointment**: Online appointment booking form with patient details
- **Contact**: Contact form and hospital information
- **About**: Hospital information and mission

## Tech Stack

### Backend
- Django 6.0
- Django REST Framework
- Django CORS Headers
- Django Filters
- SQLite (default)

### Frontend
- React 18
- React Router DOM
- Axios
- Vite

## Project Structure

```
doctor-appointment-project/
├── backend/
│   ├── config/              # Django project settings
│   ├── appointments/        # Main app with models, views, serializers
│   ├── manage.py
│   └── db.sqlite3
└── frontend/
    ├── src/
    │   ├── api/            # API configuration
    │   ├── components/     # Reusable components (Navbar, Footer)
    │   ├── pages/          # Page components
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```

## Installation & Setup

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers django-filter Pillow
   ```

3. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. Seed sample data (optional):
   ```bash
   python manage.py seed_data
   ```

5. Start the backend server:
   ```bash
   python manage.py runserver
   ```

   Backend will run at: `http://localhost:8000`
   API endpoints at: `http://localhost:8000/api/`
   Admin panel at: `http://localhost:8000/admin/`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   Frontend will run at: `http://localhost:5173`

## Default Credentials

- **Admin Username**: `admin`
- **Admin Password**: `admin123`
- **Admin Panel**: `http://localhost:8000/admin/`

## API Endpoints

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/departments/` | GET, POST | List/Create departments |
| `/api/doctors/` | GET, POST | List/Create doctors |
| `/api/doctors/available/` | GET | Get available doctors |
| `/api/doctors/by_department/` | GET | Get doctors by department |
| `/api/patients/` | GET, POST | List/Create patients |
| `/api/appointments/` | GET, POST | List/Create appointments |
| `/api/appointments/{id}/confirm/` | POST | Confirm appointment |
| `/api/appointments/{id}/cancel/` | POST | Cancel appointment |
| `/api/services/` | GET, POST | List/Create services |
| `/api/contact-messages/` | GET, POST | List/Create contact messages |
| `/api/hospital-info/` | GET, POST | List/Create hospital info |
| `/api/hospital-info/general/` | GET | Get general hospital info |

## Sample Data

The `seed_data` management command creates:
- 10 Departments (Cardiology, Neurology, Orthopedics, etc.)
- 10 Doctors with various specializations
- 6 Services
- 3 Sample patients
- Sample appointments
- Admin user

## Screenshots

The application includes:
- Modern, responsive design
- Hospital-themed color scheme (blue/white)
- Interactive cards and hover effects
- Mobile-friendly navigation
- Form validation

## Future Enhancements

- User authentication and patient portal
- Doctor dashboard for managing appointments
- Email/SMS notifications
- Payment integration
- Video consultation feature
- Prescription management
- Medical records storage

## License

MIT License
