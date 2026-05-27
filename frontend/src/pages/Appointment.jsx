import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import api from '../api/axios.jsx';

function Appointment() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const [formData, setFormData] = useState({
    doctor: '',
    department: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    payment_method: '',
    patient_name: '',
    patient_age: '',
    patient_gender: '',
    patient_phone: '',
    patient_email: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please login to book an appointment');
      navigate('/login', { state: { from: '/appointment' } });
      return;
    }
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        api.get('/doctors/?ordering=name'),
        api.get('/departments/'),
      ]);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);

      // Pre-fill patient data if logged in
      if (docRes.data.user) {
        setFormData((prev) => ({
          ...prev,
          patient_email: docRes.data.user.email,
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load doctors and departments');
    }
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      doctor: doctorId,
    }));

    const doctor = doctors.find((d) => d.id === parseInt(doctorId));
    setSelectedDoctor(doctor);
    if (doctor) {
      setFormData((prev) => ({
        ...prev,
        department: doctor.specialization,
      }));
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login', { state: { from: '/appointment' } });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/appointments/', formData);

      if (formData.payment_method && response.data.id) {
        try {
          await api.post(`/payments/${response.data.id}/process/`);
          toast.success('Appointment booked and payment completed successfully!');
        } catch (paymentError) {
          toast.warning('Appointment booked! Payment pending. Complete it from your dashboard.');
        }
      } else {
        toast.success('Appointment booked successfully! We will confirm your appointment shortly.');
      }

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        const errorMsg = Object.values(errors).flat().join(' ');
        toast.error(errorMsg || 'Failed to book appointment');
      } else {
        toast.error('Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (!isAuthenticated) {
    return (
      <div className="auth-redirect-page">
        <div className="auth-redirect-content">
          <div className="redirect-icon">🔒</div>
          <h2>Login Required</h2>
          <p>Please login to book an appointment</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <section className="page-header">
        <div className="container">
          <h1>Book an Appointment</h1>
          <p>Schedule a visit with our expert doctors</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="appointment-form-container">
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-section">
                <h2 className="section-heading">
                  <span className="icon">👤</span> Patient Information
                </h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="patient_name"
                      className="form-control"
                      value={formData.patient_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="patient_email"
                      className="form-control"
                      value={formData.patient_email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="patient_phone"
                      className="form-control"
                      value={formData.patient_phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age *</label>
                    <input
                      type="number"
                      name="patient_age"
                      className="form-control"
                      value={formData.patient_age}
                      onChange={handleChange}
                      required
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    name="patient_gender"
                    className="form-control"
                    value={formData.patient_gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-heading">
                  <span className="icon">📅</span> Appointment Details
                </h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Select Department</label>
                    <select
                      name="department"
                      className="form-control"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Select Doctor *</label>
                    <select
                      name="doctor"
                      className="form-control"
                      value={formData.doctor}
                      onChange={handleDoctorChange}
                      required
                    >
                      <option value="">Choose a doctor</option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.name} - {doctor.specialization_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedDoctor && (
                  <div className="doctor-fee-info">
                    <div className="info-row">
                      <span>Consultation Fee:</span>
                      <span className="fee-amount">₹{selectedDoctor.consultation_fee}</span>
                    </div>
                    <div className="info-row">
                      <span>Availability:</span>
                      <span>{selectedDoctor.available_days} ({selectedDoctor.available_time})</span>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date *</label>
                    <input
                      type="date"
                      name="appointment_date"
                      className="form-control"
                      value={formData.appointment_date}
                      onChange={handleChange}
                      required
                      min={today}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time *</label>
                    <select
                      name="appointment_time"
                      className="form-control"
                      value={formData.appointment_time}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="09:30">9:30 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="10:30">10:30 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="15:30">3:30 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="16:30">4:30 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason for Appointment *</label>
                  <textarea
                    name="reason"
                    className="form-control"
                    rows="4"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    placeholder="Please describe your symptoms or reason for visit"
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h2 className="section-heading">
                  <span className="icon">💳</span> Payment Options
                </h2>
                <p className="section-desc">
                  Pay online to confirm your appointment instantly, or pay at clinic.
                </p>

                <div className="payment-methods">
                  <label className={`payment-option ${formData.payment_method === 'card' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleChange}
                    />
                    <span className="payment-icon">💳</span>
                    <span className="payment-label">Card</span>
                  </label>

                  <label className={`payment-option ${formData.payment_method === 'upi' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      checked={formData.payment_method === 'upi'}
                      onChange={handleChange}
                    />
                    <span className="payment-icon">📱</span>
                    <span className="payment-label">UPI</span>
                  </label>

                  <label className={`payment-option ${formData.payment_method === 'netbanking' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="netbanking"
                      checked={formData.payment_method === 'netbanking'}
                      onChange={handleChange}
                    />
                    <span className="payment-icon">🏦</span>
                    <span className="payment-label">Net Banking</span>
                  </label>

                  <label className={`payment-option ${formData.payment_method === 'wallet' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="wallet"
                      checked={formData.payment_method === 'wallet'}
                      onChange={handleChange}
                    />
                    <span className="payment-icon">👛</span>
                    <span className="payment-label">Wallet</span>
                  </label>

                  <label className={`payment-option ${!formData.payment_method ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value=""
                      checked={!formData.payment_method}
                      onChange={handleChange}
                    />
                    <span className="payment-icon">💵</span>
                    <span className="payment-label">Pay at Clinic</span>
                  </label>
                </div>

                {selectedDoctor && formData.payment_method && (
                  <div className="payment-summary">
                    <div className="summary-row">
                      <span>Consultation Fee:</span>
                      <span>₹{selectedDoctor.consultation_fee}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total Amount:</span>
                      <span>₹{selectedDoctor.consultation_fee}</span>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
                {loading ? 'Booking Appointment...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <style jsx>{`
        .auth-redirect-page {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }

        .auth-redirect-content {
          text-align: center;
          background: white;
          padding: 50px;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .redirect-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .auth-redirect-content h2 {
          color: #333;
          margin-bottom: 10px;
        }

        .auth-redirect-content p {
          color: #666;
          margin-bottom: 25px;
        }

        .page-header {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          padding: 60px 0;
          text-align: center;
        }

        .page-header h1 {
          color: white;
          margin-bottom: 10px;
        }

        .page-header p {
          opacity: 0.95;
        }

        .appointment-form-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .appointment-form {
          background: white;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 30px;
          border-bottom: 1px solid #eee;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #1f2937;
          margin-bottom: 20px;
          font-size: 1.25rem;
        }

        .section-heading .icon {
          font-size: 1.4rem;
        }

        .section-desc {
          color: #6b7280;
          font-size: 0.9rem;
          margin-top: -10px;
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }

        .form-control {
          width: 100%;
          padding: 12px 15px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          color: #1f2937;
        }

        .form-control:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        textarea.form-control {
          resize: vertical;
        }

        .doctor-fee-info {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border: 1px solid #bae6fd;
          border-radius: 10px;
          padding: 15px 20px;
          margin-bottom: 20px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          color: #0c4a6e;
        }

        .info-row:first-child {
          border-bottom: 1px solid #bae6fd;
        }

        .fee-amount {
          font-weight: 700;
          color: #059669;
        }

        .payment-methods {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .payment-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 18px 12px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .payment-option:hover {
          border-color: #007bff;
          background: #eff6ff;
        }

        .payment-option.selected {
          border-color: #007bff;
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
        }

        .payment-option input {
          display: none;
        }

        .payment-icon {
          font-size: 1.8rem;
          margin-bottom: 6px;
        }

        .payment-label {
          font-weight: 600;
          font-size: 0.85rem;
        }

        .payment-summary {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border: 1px solid #86efac;
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          color: #166534;
        }

        .summary-row.total {
          border-top: 2px solid #86efac;
          margin-top: 10px;
          padding-top: 15px;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .summary-row.total span:last-child {
          color: #059669;
        }

        .btn-block {
          width: 100%;
        }

        .btn-lg {
          padding: 16px;
          font-size: 1.05rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .appointment-form {
            padding: 25px;
          }

          .payment-methods {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default Appointment;
