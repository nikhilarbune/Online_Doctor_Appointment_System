import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import logo from '../assets/docsure_logo.png';

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (formData.password !== formData.password2) {
      setErrors({ password2: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.success('Account created successfully! Welcome to DOCSURE.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.response?.data) {
        const apiErrors = err.response.data;
        if (typeof apiErrors === 'object') {
          setErrors(apiErrors);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <img
          src="https://img.magnific.com/free-photo/frame-medical-equipment-desk_23-2148519742.jpg"
          alt="Hospital building"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <img src={logo} alt="DOCSURE" className="logo-img1"/>
            </div>
            <h1>DOCSURE</h1>
            <p>Create your account to book appointments</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  placeholder="First_name"
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  placeholder="Last_name"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="username"
                autoComplete="username"
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                autoComplete="email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91-XXXXXXXXXX"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="password2"
                  className="form-control"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                {errors.password2 && <span className="field-error">{errors.password2}</span>}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.75) 0%, rgba(102, 126, 234, 0.7) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 520px;
          width: 100%;
          padding: 20px;
          margin: 0 auto;
        }

        .auth-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .auth-header {
          text-align: center;
          padding: 40px 30px 25px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }

        .logo-img1 {
          width: 70px;
          height: 70px;
          margin: 0 auto 10px;
          display: block;
          border-radius: 16px;
          object-fit: contain;
        }

        .auth-header h1 {
          font-size: 1.8rem;
          color: #1f2937;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .auth-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .auth-form {
          padding: 30px 35px 35px;
          text-align: left;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .form-group {
          margin-bottom: 18px;
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
          padding: 11px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          color: #1f2937;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .field-error {
          color: #ef4444;
          font-size: 0.8rem;
          display: block;
          margin-top: 5px;
        }

        .btn-block {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          font-weight: 600;
          margin-top: 10px;
        }

        .auth-footer {
          text-align: center;
          padding: 20px;
          background: #f9fafb;
        }

        .auth-footer p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .auth-footer a {
          color: #667eea;
          font-weight: 600;
          text-decoration: none;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .hero {
            min-height: auto;
            padding: 40px 20px;
          }

          .hero-content {
            max-width: 100%;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .auth-form {
            padding: 25px 25px 30px;
          }
        }

        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default Register;
