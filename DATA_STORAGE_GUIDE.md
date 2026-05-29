# 🎯 Quick Reference - Data Storage & Admin Approval System

## 📊 **DATA FLOW SUMMARY**

```
USER REGISTERS/LOGS IN
        ↓
DATA SAVED → SQLite Database (db.sqlite3) on Render Server
        ↓
USER BOOKS APPOINTMENT
        ↓
APPOINTMENT SAVED → Database with status = "pending"
        ↓
ADMIN PANEL
├─ Approve → status = "confirmed" ✅
├─ Reject → status = "rejected" ❌
└─ Cancel → status = "cancelled"
        ↓
USER DASHBOARD → Shows updated status
```

---

## 💾 **WHERE DATA IS SAVED**

| Data Type | Storage Location | Server |
|-----------|------------------|--------|
| **User Accounts** | SQLite: db.sqlite3 | Render |
| **Appointments** | SQLite: db.sqlite3 | Render |
| **Payments** | SQLite: db.sqlite3 | Render |
| **Doctors** | SQLite: db.sqlite3 | Render |
| **Patients** | SQLite: db.sqlite3 | Render |
| **Messages** | SQLite: db.sqlite3 | Render |

**Database Path**: `/backend/db.sqlite3`
**Server**: Render (online-doctor-appointment-system-2go1.onrender.com)

---

## 🔐 **ADMIN PANEL ACCESS** ⭐

### **URL**: https://online-doctor-appointment-system-2go1.onrender.com/admin/

### **Login With**:
- **Username**: Your Django superuser username
- **Password**: Your Django superuser password

> **Don't have superuser?** Create one with:
> ```bash
> python manage.py createsuperuser
> ```

---

## ✅ **HOW TO APPROVE/REJECT APPOINTMENTS**

### **Step 1**: Login to Admin Panel
https://online-doctor-appointment-system-2go1.onrender.com/admin/

### **Step 2**: Go to Appointments
Click on **Appointments** in the left sidebar

### **Step 3**: Select Pending Appointments
- Check the checkbox for appointments you want to approve/reject
- Use the dropdown menu at bottom: **Action**

### **Step 4**: Choose Action
```
✅ Confirm selected appointments    → Approves the appointment
❌ Reject selected appointments     → Declines the appointment  
🗑️ Cancel selected appointments     → Cancels the appointment
```

### **Step 5**: Click "Go"
Appointments are instantly updated!

---

## 📱 **USER EXPERIENCE**

### **When User Books Appointment** 📝
```
Frontend: "Your appointment has been submitted for approval"
↓
Database: status = "pending"
↓
User Dashboard: Shows "Pending" with ⏳ icon
```

### **When Admin Approves** ✅
```
Admin Panel: Click "Confirm"
↓
Database: status = "confirmed"
↓
User Dashboard: Shows "Confirmed" with ✅ icon
↓
Frontend: Can see appointment details
```

### **When Admin Rejects** ❌
```
Admin Panel: Click "Reject"
↓
Database: status = "rejected"
↓
User Dashboard: Shows "Rejected" with ❌ icon
↓
User can book another appointment
```

---

## 🎮 **ADMIN FEATURES AVAILABLE**

### **Dashboard** 📊
- View recent activities
- See system statistics

### **Appointments** 🏥
- View all appointments
- Filter by status/doctor/date
- Bulk approve/reject
- Edit appointment details
- Add doctor's notes & prescriptions

### **Patients** 👥
- View all registered patients
- Edit patient profiles
- View medical history

### **Doctors** 👨‍⚕️
- Manage doctor availability
- Update consultation fees
- Mark available/unavailable

### **Payments** 💳
- Track all payments
- Update payment status
- View transaction details

### **Departments & Services** 🏢
- Manage hospital departments
- Add/edit services

### **Messages** 📧
- View contact messages from users

---

## 🚀 **SYSTEM ARCHITECTURE**

```
┌─────────────────────────────────────┐
│     FRONTEND (Vercel)               │
│  https://frontend-opal-eight.../    │
│  ├─ Register/Login Page             │
│  ├─ Dashboard                       │
│  ├─ Book Appointment                │
│  └─ View Doctors                    │
└──────────────────┬──────────────────┘
                   │ API Calls
                   ↓
┌─────────────────────────────────────┐
│   BACKEND API (Render)              │
│  https://online-doctor-.../         │
│  ├─ /api/auth/register/             │
│  ├─ /api/auth/login/                │
│  ├─ /api/appointments/              │
│  ├─ /api/doctors/                   │
│  └─ /api/payments/                  │
└──────────────────┬──────────────────┘
                   │ Reads/Writes
                   ↓
┌─────────────────────────────────────┐
│   SQLite DATABASE (Render)          │
│  File: backend/db.sqlite3           │
│  ├─ Users                           │
│  ├─ Patients                        │
│  ├─ Appointments                    │
│  ├─ Payments                        │
│  ├─ Doctors                         │
│  └─ Services                        │
└─────────────────────────────────────┘
     ↑
     │ Admin Access
     │
┌─────────────────────────────────────┐
│     ADMIN PANEL (Django)            │
│  /admin/                            │
│  └─ Approve/Reject Appointments    │
└─────────────────────────────────────┘
```

---

## 🔧 **TROUBLESHOOTING**

### ❌ **Admin Panel Not Loading?**
- Solution: Wait 2-3 minutes for Render to redeploy
- Check: https://render.com dashboard

### ❌ **Can't Login to Admin?**
- Create superuser:
  ```bash
  python manage.py createsuperuser
  ```

### ❌ **Appointments Not Visible?**
- Go to Admin → Appointments
- Use filter dropdown to see by status

### ❌ **Want to Add Appointment Manually?**
- Go to Appointments → Add Appointment
- Fill patient, doctor, date, time
- Save

---

## 📞 **LINKS**

| Resource | URL |
|----------|-----|
| **Frontend** | https://frontend-opal-eight-42.vercel.app/ |
| **Backend** | https://online-doctor-appointment-system-2go1.onrender.com/ |
| **Admin Panel** | https://online-doctor-appointment-system-2go1.onrender.com/admin/ |
| **API Docs** | https://online-doctor-appointment-system-2go1.onrender.com/api/ |

---

## ✨ **QUICK ACTIONS**

| Action | Steps |
|--------|-------|
| **Approve Appointment** | Admin → Appointments → Select → Confirm → Go |
| **Reject Appointment** | Admin → Appointments → Select → Reject → Go |
| **View Patient Profile** | Admin → Patients → Click name |
| **Update Doctor Status** | Admin → Doctors → Click → Change availability |
| **View Payments** | Admin → Payments → Filter by status |
| **Add New Doctor** | Admin → Doctors → Add Doctor |

---

**Status**: ✅ System Working
**Last Updated**: May 29, 2026
**System**: DOCSURE v1.0
