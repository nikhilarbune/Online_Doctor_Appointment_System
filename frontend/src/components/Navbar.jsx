import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/docsure_logo.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    
    
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
          <div className="logo-container">
            <img src={logo} alt="DOCSURE" className="logo-img"/>
          </div>
        </Link>

          <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/departments" className="nav-link" onClick={() => setIsOpen(false)}>
              Departments
            </Link>
            <Link to="/doctors" className="nav-link" onClick={() => setIsOpen(false)}>
              Doctors
            </Link>
            <Link to="/appointment" className="nav-link nav-link-cta" onClick={() => setIsOpen(false)}>
              Book Appointment
            </Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>
              Contact
            </Link>
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <span className="user-greeting">{user?.first_name || 'User'}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>

          <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
            <span className="hamburger"></span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid #f3f4f6;
        }

        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .logo {
          text-decoration: none;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-img {
          width: 120px;      
          height: auto;
          object-fit: contain;
          margin-left: -10px;
          
        }

        .nav-menu {
          display: flex;
          gap: 28px;
          align-items: center;
        }

        .nav-link {
          text-decoration: none;
          color: #4b5563;
          font-weight: 500;
          font-size: 1.2rem;
          transition: color 0.2s;
          padding: 8px 0;
        }

        .nav-link:hover {
          color: #667eea;
        }

        .nav-link-cta {
          color: #667eea;
          font-weight: 600;
        }

        .nav-link-cta:hover {
          color: #764ba2;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-greeting {
          color: #6b7280;
          font-size: 0.9rem;
          font-weight: 500;
          margin-right: 8px;
        }

        .btn-sm {
          padding: 8px 18px;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          border: 1.5px solid #e5e7eb;
          background: white;
          color: #1f2937;
        }

        .btn-sm:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .btn-primary.btn-sm {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: transparent;
          color: white;
        }

        .btn-primary.btn-sm:hover {
          opacity: 0.9;
          color: white;
        }

        .btn-outline {
          background: transparent;
        }

        .nav-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .hamburger {
          display: block;
          width: 22px;
          height: 2px;
          background: #374151;
          position: relative;
          transition: background 0.2s;
        }

        .hamburger::before,
        .hamburger::after {
          content: '';
          position: absolute;
          width: 22px;
          height: 2px;
          background: #374151;
          transition: transform 0.2s;
        }

        .hamburger::before {
          top: -7px;
        }

        .hamburger::after {
          top: 7px;
        }

        @media (max-width: 900px) {
          .nav-menu {
            position: fixed;
            top: 65px;
            left: -100%;
            width: 100%;
            background: white;
            flex-direction: column;
            padding: 20px;
            gap: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: left 0.3s ease;
          }

          .nav-menu.active {
            left: 0;
          }

          .nav-actions {
            display: none;
          }

          .nav-toggle {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
