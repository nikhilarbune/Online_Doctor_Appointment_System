import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios.js';

function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [apptRes, paymentRes] = await Promise.all([
        api.get('/appointments/my_appointments/'),
        api.get('/payments/'),
      ]);
      setAppointments(apptRes.data);
      setPayments(paymentRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-pending', label: 'Pending' },
      confirmed: { class: 'badge-confirmed', label: 'Confirmed' },
      rejected: { class: 'badge-rejected', label: 'Rejected' },
      completed: { class: 'badge-completed', label: 'Completed' },
      cancelled: { class: 'badge-cancelled', label: 'Cancelled' },
      'no_show': { class: 'badge-noshow', label: 'No Show' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`status-badge ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const getPaymentStatus = (appointmentId) => {
    const payment = payments.find(p => p.appointment === appointmentId);
    if (!payment) return { status: 'unpaid', label: 'Unpaid', class: 'unpaid' };
    return {
      status: payment.status,
      label: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
      class: payment.status,
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <div className="auth-icon">🔒</div>
        <h2>Login Required</h2>
        <p>Please login to view your dashboard</p>
        <Link to="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div className="container">
          <h1>Dashboard</h1>
          <p>Manage your appointments and medical records</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="dashboard-grid">
            <aside className="dashboard-sidebar">
              <div className="profile-card">
                <div className="profile-avatar">
                  {user?.first_name?.charAt(0) || 'U'}
                </div>
                <h3>{user?.first_name} {user?.last_name}</h3>
                <p className="profile-email">{user?.email}</p>
              </div>

              <nav className="dashboard-nav">
                <button
                  className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('appointments')}
                >
                  My Appointments
                </button>
                <button
                  className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('payments')}
                >
                  Payment History
                </button>
                <Link to="/appointment" className="nav-item nav-action">
                  Book New Appointment
                </Link>
              </nav>
            </aside>

            <main className="dashboard-content">
              {activeTab === 'appointments' && (
                <div className="content-section">
                  <h2>My Appointments</h2>

                  {appointments.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📅</div>
                      <h3>No appointments yet</h3>
                      <p>Book your first appointment with our expert doctors.</p>
                      <Link to="/appointment" className="btn btn-primary">Book Now</Link>
                    </div>
                  ) : (
                    <div className="appointments-list">
                      {appointments.map((appointment) => {
                        const paymentStatus = getPaymentStatus(appointment.id);
                        return (
                          <div key={appointment.id} className="appointment-card">
                            <div className="appointment-header">
                              <div className="doctor-info">
                                <div className="doctor-avatar">
                                  {appointment.doctor_name?.charAt(0) || 'D'}
                                </div>
                                <div>
                                  <h4>Dr. {appointment.doctor_name}</h4>
                                  <p>{appointment.doctor_specialization}</p>
                                </div>
                              </div>
                              {getStatusBadge(appointment.status)}
                            </div>

                            <div className="appointment-details">
                              <div className="detail">
                                <span className="detail-icon">📅</span>
                                <span>{new Date(appointment.appointment_date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}</span>
                              </div>
                              <div className="detail">
                                <span className="detail-icon">🕐</span>
                                <span>{appointment.appointment_time}</span>
                              </div>
                              <div className="detail">
                                <span className="detail-icon">🏥</span>
                                <span>{appointment.department_name}</span>
                              </div>
                            </div>

                            <div className="appointment-footer">
                              <div className={`payment-status ${paymentStatus.class}`}>
                                Payment: {paymentStatus.label}
                              </div>
                              {appointment.status === 'pending' && (
                                <span className="action-note">Waiting for confirmation</span>
                              )}
                              {appointment.status === 'confirmed' && (
                                <span className="action-note success">Appointment confirmed</span>
                              )}
                              {appointment.status === 'rejected' && (
                                <span className="action-note error">Appointment was rejected</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="content-section">
                  <h2>Payment History</h2>

                  {payments.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">💳</div>
                      <h3>No payments yet</h3>
                      <p>Your payment history will appear here once you make payments.</p>
                    </div>
                  ) : (
                    <div className="payments-list">
                      {payments.map((payment) => (
                        <div key={payment.id} className="payment-card">
                          <div className="payment-header">
                            <div className="payment-icon-box">💳</div>
                            <div>
                              <h4>Payment for Appointment</h4>
                              <p>
                                Dr. {payment.appointment_details?.doctor_name} -{' '}
                                {new Date(payment.appointment_details?.appointment_date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="payment-body">
                            <div className="payment-amount">₹{payment.amount}</div>
                            <div className={`payment-status-badge ${payment.status}`}>
                              {payment.status === 'completed' ? '✓' : payment.status === 'pending' ? '⏳' : '✗'}{' '}
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </div>
                          </div>
                          <div className="payment-footer">
                            <span>Method: {payment.payment_method}</span>
                            {payment.transaction_id && (
                              <span>TxN: {payment.transaction_id}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 50px 0;
          text-align: center;
        }

        .dashboard-header h1 {
          color: white;
          margin-bottom: 8px;
          font-size: 2rem;
        }

        .dashboard-header p {
          opacity: 0.9;
          font-size: 1rem;
        }

        .auth-required {
          text-align: center;
          padding: 100px 20px;
          background: #f9fafb;
        }

        .auth-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .auth-required h2 {
          margin-bottom: 10px;
          color: #1f2937;
        }

        .auth-required p {
          color: #6b7280;
          margin-bottom: 25px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
        }

        .dashboard-sidebar {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .profile-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          text-align: center;
          margin-bottom: 20px;
          border: 1px solid #f3f4f6;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          margin: 0 auto 15px;
        }

        .profile-card h3 {
          color: #1f2937;
          margin-bottom: 5px;
          font-size: 1.1rem;
        }

        .profile-email {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .dashboard-nav {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          overflow: hidden;
          border: 1px solid #f3f4f6;
        }

        .nav-item {
          display: block;
          width: 100%;
          padding: 14px 18px;
          border: none;
          background: #f9fafb;
          text-align: left;
          cursor: pointer;
          font-size: 0.95rem;
          color: #4b5563;
          transition: all 0.2s;
          text-decoration: none;
          font-weight: 500;
        }

        .nav-item:hover {
          background: #f3f4f6;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .nav-action {
          border-top: 1px solid #e5e7eb;
          text-align: center;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          font-weight: 600;
        }

        .nav-action:hover {
          opacity: 0.9;
        }

        .content-section {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          border: 1px solid #f3f4f6;
        }

        .content-section h2 {
          color: #1f2937;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e5e7eb;
          font-size: 1.4rem;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-state h3 {
          color: #1f2937;
          margin-bottom: 10px;
        }

        .empty-state p {
          color: #6b7280;
          margin-bottom: 20px;
        }

        .appointment-card {
          background: #f9fafb;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 15px;
          border-left: 4px solid #667eea;
        }

        .appointment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .doctor-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .doctor-avatar {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .doctor-info h4 {
          color: #1f2937;
          margin-bottom: 3px;
          font-size: 1rem;
        }

        .doctor-info p {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .status-badge {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .badge-pending { background: #fef3c7; color: #92400e; }
        .badge-confirmed { background: #d1fae5; color: #065f46; }
        .badge-rejected { background: #fee2e2; color: #991b1b; }
        .badge-completed { background: #dbeafe; color: #1e40af; }
        .badge-cancelled { background: #e5e7eb; color: #374151; }
        .badge-noshow { background: #fecaca; color: #991b1b; }

        .appointment-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 15px;
          padding: 15px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .detail {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4b5563;
          font-size: 0.9rem;
        }

        .detail-icon {
          font-size: 1.1rem;
        }

        .appointment-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .payment-status {
          font-weight: 600;
          font-size: 0.85rem;
        }

        .payment-status.completed { color: #059669; }
        .payment-status.pending { color: #d97706; }
        .payment-status.failed { color: #dc2626; }
        .payment-status.unpaid { color: #6b7280; }

        .action-note {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .action-note.success { color: #059669; font-weight: 500; }
        .action-note.error { color: #dc2626; }

        .payment-card {
          background: #f9fafb;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 15px;
        }

        .payment-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .payment-icon-box {
          font-size: 2.5rem;
        }

        .payment-header h4 {
          color: #1f2937;
          margin-bottom: 3px;
          font-size: 1rem;
        }

        .payment-header p {
          color: #6b7280;
          font-size: 0.85rem;
        }

        .payment-body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-top: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
        }

        .payment-amount {
          font-size: 1.4rem;
          font-weight: 700;
          color: #667eea;
        }

        .payment-status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .payment-status-badge.completed { background: #d1fae5; color: #065f46; }
        .payment-status-badge.pending { background: #fef3c7; color: #92400e; }
        .payment-status-badge.failed { background: #fee2e2; color: #991b1b; }

        .payment-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 10px;
        }

        @media (max-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            position: static;
          }

          .appointment-details {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
