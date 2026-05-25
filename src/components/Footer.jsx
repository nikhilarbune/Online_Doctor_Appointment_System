import { Link } from 'react-router-dom';
import logo from '../assets/docsure_logofooter.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src={logo} alt="DOCSURE" className="logo-img"/>
            </div>
            <p>
              Your Health, Our Priority. Providing world-class healthcare
              with compassion and excellence.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/doctors">Our Doctors</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Departments</h4>
            <ul>
              <li><Link to="/departments">Cardiology</Link></li>
              <li><Link to="/departments">Neurology</Link></li>
              <li><Link to="/departments">Orthopedics</Link></li>
              <li><Link to="/departments">Pediatrics</Link></li>
              <li><Link to="/departments">More...</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="contact-info">
              <li>📍 123 Health Street, Medical District</li>
              <li>📞 +91-1234567890</li>
              <li>📧 info@docsure.com</li>
              <li>🚑 Emergency: 108</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} DOCSURE Hospital. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #1a1a2e;
          color: white;
          padding: 60px 0 0;
          margin-top: auto;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .footer-logo .logo-img {
          width: 300px;
          height: 150px;
          object-fit: contain;
        }

        .footer-section h4 {
          color: white;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .footer-section p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section ul li {
          margin-bottom: 10px;
        }

        .footer-section ul li a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-section ul li a:hover {
          color: #007bff;
        }

        .contact-info li {
          color: rgba(255, 255, 255, 0.8);
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 15px;
        }

        .social-links a {
          font-size: 1.5rem;
          text-decoration: none;
          transition: transform 0.3s;
        }

        .social-links a:hover {
          transform: scale(1.2);
        }

        .footer-bottom {
          padding: 20px 0;
          text-align: center;
        }

        .footer-bottom p {
          color: rgba(255, 255, 255, 0.6);
        }

        @media (max-width: 992px) {
          .footer-content {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
