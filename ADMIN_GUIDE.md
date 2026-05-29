# 📋 Doctor Appointment System - Admin Guide

## 🗂️ **DATA STORAGE & ARCHITECTURE**

### **Where is Data Saved?**
All user data is saved in **SQLite Database (db.sqlite3)** hosted on **Render**:
- 📍 **Location**: `backend/db.sqlite3` on Render server
- 🌐 **Host**: https://online-doctor-appointment-system-2go1.onrender.com/
- 💾 **Database Engine**: Django ORM with SQLite

### **Data Structure**

```
┌─────────────────────────────────────────┐
│           BACKEND SERVER                │
│      (Django + SQLite Database)         │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│         USER REGISTRATION               │
├─────────────────────────────────────────┤
│ • Username, Email, Password             │
│ • Phone Number                          │
│ • First Name, Last Name                 │
│ → Stored in: User Model + Patient Model │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│       APPOINTMENT BOOKING               │
├─────────────────────────────────────────┤
│ • Patient Name                          │
│ • Doctor Selected                       │
│ • Department                            │
│ • Appointment Date & Time               │
│ • Reason for Appointment                │
│ • Status: pending → confirmed/rejected  │
│ → Stored in: Appointment Model          │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│       PAYMENT PROCESSING                │
├─────────────────────────────────────────┤
│ • Amount                                │
│ • Payment Method (Card, UPI, etc.)      │
│ • Status: pending → completed           │
│ • Transaction ID                        │
│ → Stored in: Payment Model              │
└─────────────────────────────────────────┘
```

---

## 🔐 **ADMIN PANEL ACCESS**

### **Step 1: Access Admin Panel**
**URL**: https://online-doctor-appointment-system-2go1.onrender.com/admin/

### **Step 2: Login with Admin Credentials**
```
Username: (your Django superuser)
Password: (your Django superuser password)
```

> **Note**: Need to create superuser? Run:
> ```bash
> python manage.py createsuperuser
> ```

---

## ✅ **APPOINTMENT MANAGEMENT**

### **How Admin Approves/Rejects Appointments**

#### **Method 1: Bulk Actions (Recommended)**
1. Go to **Admin Panel → Appointments**
2. **Select appointments** you want to approve/reject using checkboxes
3. Choose action from dropdown:
   - ✅ **Confirm selected appointments**
   - ❌ **Reject selected appointments**
   - 🗑️ **Cancel selected appointments**
4. Click **Go**

#### **Method 2: Individual Edit**
1. Go to **Admin Panel → Appointments**
2. Click on appointment to open
3. Change **Status** field to:
   - `pending` - Waiting for review
   - `confirmed` - ✅ Approved
   - `rejected` - ❌ Declined
   - `completed` - Appointment finished
   - `cancelled` - Appointment cancelled
   - `no_show` - Patient didn't show up
4. Click **Save**

### **Appointment Status Flow**
```
New Booking
    ↓
[pending] ← Status: Waiting for admin approval
    ↓
├─→ [confirmed] ← Admin approves
│       ↓
│   [completed] ← After appointment is done
│
└─→ [rejected] ← Admin rejects
```

### **Key Appointment Fields**

| Field | Description |
|-------|-------------|
| **Patient** | Who booked the appointment |
| **Doctor** | Which doctor appointment is for |
| **Department** | Medical department (Cardiology, etc.) |
| **Appointment Date** | When the appointment is scheduled |
| **Appointment Time** | Time of appointment |
| **Reason** | Why patient is visiting |
| **Status** | Current status (pending/confirmed/rejected) |
| **Notes** | Doctor's clinical notes (optional) |
| **Prescription** | Treatment details (optional) |

---

## 💳 **PAYMENT MANAGEMENT**

### **View & Manage Payments**
1. Go to **Admin Panel → Payments**
2. See all payment transactions with:
   - Amount charged
   - Payment Method (Card, UPI, Net Banking, etc.)
   - Status (Pending, Completed, Failed)
   - Transaction ID

### **Update Payment Status**
1. Click on payment to edit
2. Change **Status**:
   - `pending` - Payment not yet processed
   - `completed` - ✅ Payment received
   - `failed` - ❌ Payment failed
   - `refunded` - 💰 Refund issued
3. Click **Save**

---

## 👥 **USER & PATIENT MANAGEMENT**

### **Patient Records**
1. Go to **Admin Panel → Patients**
2. View all registered patients with:
   - Name, Age, Gender
   - Contact Information (Phone, Email)
   - Medical History
   - Blood Group
   - Address

### **Edit Patient Information**
- Click on patient to view full profile
- Update personal and medical information
- Save changes

---

## 👨‍⚕️ **DOCTOR MANAGEMENT**

### **Doctor List**
1. Go to **Admin Panel → Doctors**
2. Manage doctors with options to:
   - Mark as Available/Unavailable
   - Update qualifications
   - Adjust consultation fees
   - Modify availability schedule

### **Doctor Fields**
- Name, Phone, Email
- Specialization (Department)
- Qualification
- Years of Experience
- Bio
- Consultation Fee
- Available Days & Time
- Status (Available/Unavailable)

---

## 🏥 **DEPARTMENT & SERVICE MANAGEMENT**

### **Departments**
1. Go to **Admin Panel → Departments**
2. Add new specializations (Cardiology, Neurology, etc.)
3. Add department descriptions

### **Services**
1. Go to **Admin Panel → Services**
2. Add hospital services offered
3. Enable/disable services

---

## 📞 **CONTACT MESSAGES**

### **View Patient Messages**
1. Go to **Admin Panel → Contact Messages**
2. See messages from "Contact Us" form
3. Mark as read/unread
4. Search messages by name, email, or subject

---

## 🏢 **HOSPITAL INFORMATION**

### **Update Hospital Details**
1. Go to **Admin Panel → Hospital Information**
2. Configure:
   - Hospital Name
   - Phone & Email
   - Address
   - Emergency Number
   - Social Media Links
   - Logo/Images

---

## 📊 **QUICK DASHBOARD STATS**

### **To See System Overview:**
1. Go to **Admin Panel Dashboard**
2. Check recent activities
3. View quick statistics about:
   - Total Appointments
   - Confirmed vs Pending
   - Payment Status
   - New Registrations

---

## 🔍 **FILTERING & SEARCH**

### **Filter Appointments by:**
- Status (Pending, Confirmed, Rejected)
- Doctor Name
- Patient Name
- Date Range
- Department

### **Search Appointments:**
1. Use search box at top right
2. Search by:
   - Patient name
   - Doctor name
   - Reason for visit

### **Filter Payments by:**
- Payment Status
- Payment Method
- Date Range

---

## 🚀 **FRONTEND ↔ BACKEND DATA FLOW**

### **Step 1: User Registration**
```
Frontend (Register Page)
    ↓
User fills: Name, Email, Username, Phone, Password
    ↓
Backend API Endpoint: POST /api/auth/register/
    ↓
Database: Creates User + Patient record
    ↓
Response: JWT Token + User Data
    ↓
Frontend: Stores token in localStorage
```

### **Step 2: Appointment Booking**
```
Frontend (Book Appointment)
    ↓
User selects: Doctor, Date, Time, Reason
    ↓
Backend API: POST /api/appointments/
    ↓
Database: Creates Appointment with status='pending'
    ↓
Frontend: Shows "Pending Admin Approval" message
    ↓
Admin Panel: Admin sees pending appointment
    ↓
Admin Action: Confirm or Reject
    ↓
Database: Updates Appointment status
    ↓
Frontend Dashboard: User sees updated status
```

### **Step 3: Payment Processing**
```
Frontend (Payment Page)
    ↓
User enters payment details
    ↓
Backend: POST /api/payments/process/
    ↓
Database: Creates Payment record
    ↓
Admin Panel: Admin verifies payment
    ↓
Status updates: pending → completed
    ↓
Frontend: Appointment confirmed to user
```

---

## 📱 **FRONTEND FEATURES**

### **User Dashboard**
- View all booked appointments
- See appointment status (Pending/Confirmed/Rejected)
- View payment status
- Cancel appointments
- Update profile

### **Appointment Booking**
- Select Doctor
- Choose Date & Time
- Enter reason for visit
- View consultation fee

### **Available Pages**
- `/` - Home
- `/login` - User Login
- `/register` - New User Registration
- `/dashboard` - User Dashboard (Login Required)
- `/appointment` - Book Appointment
- `/doctors` - View Doctors
- `/departments` - View Departments
- `/contact` - Contact Form

---

## 🔗 **API ENDPOINTS FOR APPOINTMENTS**

### **Create Appointment**
```
POST /api/appointments/
Body: {
  "doctor_id": 1,
  "appointment_date": "2026-06-15",
  "appointment_time": "10:00:00",
  "reason": "General Checkup"
}
Response: Appointment with status='pending'
```

### **Approve Appointment**
```
POST /api/appointments/{id}/confirm/
Response: Status changed to 'confirmed'
```

### **Reject Appointment**
```
POST /api/appointments/{id}/reject/
Response: Status changed to 'rejected'
```

### **Get My Appointments**
```
GET /api/appointments/my_appointments/
Response: List of user's appointments
```

---

## ⚠️ **COMMON ISSUES & FIXES**

### **Issue: Admin Panel Shows 500 Error**
**Fix**: 
1. Check database connection
2. Run migrations: `python manage.py migrate`
3. Restart server

### **Issue: Appointments Not Saving**
**Fix**:
1. Check if Patient profile exists for user
2. Verify appointment date is in future
3. Check backend logs for validation errors

### **Issue: Payment Not Recording**
**Fix**:
1. Ensure appointment is confirmed first
2. Check payment amount is positive
3. Verify payment method is valid

---

## 💡 **ADMIN BEST PRACTICES**

✅ **DO:**
- Review pending appointments regularly
- Confirm appointments within 2-4 hours
- Update doctor availability when not available
- Monitor payment status
- Respond to contact messages

❌ **DON'T:**
- Manually change appointment times (use confirm/reject)
- Delete appointments (use cancel status instead)
- Leave appointments in pending for too long
- Modify patient medical history without verification

---

## 📞 **SUPPORT RESOURCES**

### **Backend URL**: https://online-doctor-appointment-system-2go1.onrender.com/
### **Frontend URL**: https://frontend-opal-eight-42.vercel.app/
### **Admin Panel**: https://online-doctor-appointment-system-2go1.onrender.com/admin/

---

**Last Updated**: May 29, 2026
**System**: DOCSURE Doctor Appointment System v1.0
