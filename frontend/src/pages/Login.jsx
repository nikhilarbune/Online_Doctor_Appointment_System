import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import logo from '../assets/docsure_logo.png';



function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const toast = useContext(ToastContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      toast.success('Welcome back! Login successful.');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div>

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
              <p>Welcome back! Please login to your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>



      

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
        max-width: 450px;
        width: 100%;
        padding: 20px;
        margin: 0 auto;
      }


        // .auth-page {
        //   min-height: calc(100vh - 80px);
        //   background: linear-gradient(135deg, #8997d5 0%, #b990e2 100%);
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   padding: 40px 20px;
        // }

        .auth-container {
          width: 100%;
          max-width: 420px; 
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
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          
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
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
      `}</style>
    </div>
  );
}

export default Login;
