import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.jsx';

function Home() {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [hospitalInfo, setHospitalInfo] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [deptRes, docRes, svcRes, infoRes] = await Promise.all([
        api.get('/departments/'),
        api.get('/doctors/?ordering=-experience_years'),
        api.get('/services/'),
        api.get('/hospital-info/general/'),
      ]);
      setDepartments(deptRes.data.slice(0, 6));
      setDoctors(docRes.data.slice(0, 6));
      setServices(svcRes.data);
      setHospitalInfo(infoRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <img
          src='https://t4.ftcdn.net/jpg/02/70/36/25/360_F_270362596_kIpf2k7Q5PBjR5wWTp5qentfEeQnm5dM.jpg'
            // src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80"
            alt="Hospital building"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-content">
          <span className="hero-badge">Trusted Healthcare</span>
          <h1>DOCSURE</h1>
          <p className="hero-subtitle">
            Advanced Medical Care with Compassion
          </p>
          <p className="hero-description">
            Experience healthcare delivered by expert specialists with state-of-the-art
            technology and personalized attention. Your health is our priority.
          </p>
          <div className="hero-buttons">
            <Link to="/appointment" className="btn btn-primary btn-lg">
              Book Appointment
            </Link>
            <Link to="/doctors" className="btn btn-white btn-lg">
              Find a Doctor
            </Link>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-check"></span>
              <span>24/7 Emergency Care</span>
            </div>
            <div className="hero-feature">
              <span className="feature-check"></span>
              <span>Expert Specialists</span>
            </div>
            <div className="hero-feature">
              <span className="feature-check"></span>
              <span>Online Consultations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="container">
          <div className="stats">
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">20+</div>
              <div className="stat-label">Specialty Departments</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Patients Treated</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Emergency Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          <div className="section-title">
            <span className="section-subtitle">Our Services</span>
            <h2>Comprehensive Healthcare Solutions</h2>
            <p>From routine checkups to specialized treatments, we offer complete medical care</p>
          </div>
          <div className="grid grid-4">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{getServiceIcon(service.name)}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="section departments-section">
        <div className="container">
          <div className="section-title">
            <span className="section-subtitle">Specializations</span>
            <h2>Centers of Excellence</h2>
            <p>Advanced care across multiple medical disciplines</p>
          </div>
          <div className="grid grid-3">
            {departments.map((dept) => (
              <div key={dept.id} className="department-card">
                <div className="dept-image">
                  <img src={getDeptImage(dept.name)} alt={dept.name} />
                </div>
                <div className="dept-body">
                  <h3>{dept.name}</h3>
                  <p>{dept.description}</p>
                  <div className="dept-footer">
                    <span className="doctor-count">{dept.doctors_count || 0} Specialists</span>
                    <Link to="/departments" className="learn-more">Learn More</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="section doctors-section">
        <div className="container">
          <div className="section-title">
            <span className="section-subtitle">Medical Team</span>
            <h2>Meet Our Specialists</h2>
            <p>Highly qualified doctors dedicated to your well-being</p>
          </div>
          <div className="grid grid-3">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="doctor-card">
                <div className="doctor-image">
                  <img src={getDoctorImage()} alt={`Dr. ${doctor.name}`} />
                </div>
                <div className="doctor-body">
                  <h3>Dr. {doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialization_name}</p>
                  <p className="doctor-qualification">{doctor.qualification}</p>
                  <div className="doctor-stats">
                    <div className="stat">
                      <span>{doctor.experience_years} years</span>
                      <span className="stat-label">Experience</span>
                    </div>
                    <div className="stat">
                      <span>₹{doctor.consultation_fee}</span>
                      <span className="stat-label">Consultation</span>
                    </div>
                  </div>
                  <div className="doctor-availability">
                    <span className={`status ${doctor.is_available ? 'available' : 'unavailable'}`}>
                      {doctor.is_available ? 'Accepting patients' : 'Not available'}
                    </span>
                  </div>
                  <Link to="/appointment" className="btn btn-primary btn-block">
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/doctors" className="btn btn-secondary">View All Doctors</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-section">
        <div className="container">
          <div className="section-title">
            <span className="section-subtitle">Why Choose DOCSURE</span>
            <h2>Healthcare You Can Trust</h2>
          </div>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-box">🔬</div>
              <h3>Advanced Technology</h3>
              <p>State-of-the-art medical equipment and diagnostic facilities</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon-box">🏆</div>
              <h3>Accredited Excellence</h3>
              <p>Nationally accredited hospital with quality standards</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon-box">👥</div>
              <h3>Patient-Centric Care</h3>
              <p>Personalized treatment plans focused on patient well-being</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon-box">💻</div>
              <h3>Telemedicine</h3>
              <p>Online consultations with expert doctors from anywhere</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Emergency Care?</h2>
            <p>Our emergency services are available 24 hours a day, 7 days a week</p>
            <a href={`tel:${hospitalInfo.emergency_number || '108'}`} className="btn btn-white btn-lg">
              Call {hospitalInfo.emergency_number || '108'} Now
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero {
          position: relative;
          min-height: 650px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(102, 126, 234, 0.85) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 700px;
          text-align: center;
          margin: 0 auto;
          padding: 80px 20px;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 8px 20px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
        }

        .hero h1 {
          font-size: 4.5rem;
          margin-bottom: 15px;
          color: white;
          font-weight: 800;
          letter-spacing: -2px;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          margin-bottom: 15px;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 400;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 35px;
          max-width: 550px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin-bottom: 35px;
        }

        .btn-lg {
          padding: 14px 32px;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 10px;
        }

        .btn-white {
          background: white;
          color: #667eea;
        }

        .btn-white:hover {
          background: #f8f9fa;
        }

        .hero-features {
          display: flex;
          gap: 25px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hero-feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .feature-check {
          width: 18px;
          height: 18px;
          background: #10b981;
          border-radius: 50%;
          position: relative;
        }

        .feature-check::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 6px;
          width: 5px;
          height: 9px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .stats-section {
          background: white;
          margin-top: -60px;
          position: relative;
          z-index: 2;
          padding-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #f3f4f6;
        }

        .stat-number {
          font-size: 2.2rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 5px;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .section-subtitle {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .section-title h2 {
          font-size: 2.2rem;
          color: #1f2937;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .section-title p {
          color: #6b7280;
          font-size: 1.05rem;
        }

        .services-section {
          background: #f9fafb;
        }

        .service-card {
          background: white;
          padding: 28px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
          border: 1px solid #f3f4f6;
        }

        .service-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .service-icon {
          font-size: 2.8rem;
          margin-bottom: 15px;
        }

        .service-card h3 {
          color: #1f2937;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }

        .service-card p {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .departments-section {
          background: white;
        }

        .department-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
          border: 1px solid #f3f4f6;
        }

        .department-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .dept-image {
          height: 160px;
          overflow: hidden;
        }

        .dept-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .department-card:hover .dept-image img {
          transform: scale(1.05);
        }

        .dept-body {
          padding: 22px;
        }

        .dept-body h3 {
          color: #1f2937;
          margin-bottom: 8px;
          font-size: 1.15rem;
        }

        .dept-body p {
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .dept-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 15px;
          border-top: 1px solid #f3f4f6;
        }

        .doctor-count {
          color: #667eea;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .learn-more {
          color: #764ba2;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .learn-more:hover {
          text-decoration: underline;
        }

        .doctors-section {
          background: #f9fafb;
        }

        .doctor-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          transition: all 0.3s;
          border: 1px solid #f3f4f6;
        }

        .doctor-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .doctor-image {
          height: 200px;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .doctor-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .doctor-body {
          padding: 22px;
          text-align: center;
        }

        .doctor-body h3 {
          color: #1f2937;
          margin-bottom: 5px;
          font-size: 1.15rem;
        }

        .doctor-specialty {
          color: #667eea;
          font-weight: 600;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }

        .doctor-qualification {
          color: #6b7280;
          font-size: 0.85rem;
          margin-bottom: 15px;
        }

        .doctor-stats {
          display: flex;
          justify-content: center;
          gap: 25px;
          margin-bottom: 15px;
          padding: 15px 0;
          border-top: 1px solid #f3f4f6;
          border-bottom: 1px solid #f3f4f6;
        }

        .doctor-stats .stat {
          text-align: center;
        }

        .doctor-stats .stat span:first-child {
          display: block;
          color: #1f2937;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .doctor-stats .stat .stat-label {
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .doctor-availability {
          margin-bottom: 15px;
        }

        .doctor-availability .status {
          font-size: 0.85rem;
          padding: 5px 12px;
          border-radius: 20px;
          display: inline-block;
        }

        .doctor-availability .status.available {
          background: #d1fae5;
          color: #065f46;
        }

        .doctor-availability .status.unavailable {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-block {
          width: 100%;
          padding: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 8px;
        }

        .section-cta {
          text-align: center;
          margin-top: 40px;
        }

        .why-section {
          background: white;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .feature-box {
          text-align: center;
          padding: 28px 20px;
          border-radius: 12px;
          background: #f9fafb;
          transition: all 0.3s;
          border: 1px solid #f3f4f6;
        }

        .feature-box:hover {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          transform: translateY(-4px);
          border-color: transparent;
        }

        .feature-box:hover h3,
        .feature-box:hover p {
          color: white;
        }

        .feature-icon-box {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .feature-box h3 {
          color: #1f2937;
          margin-bottom: 10px;
          font-size: 1.05rem;
        }

        .feature-box p {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .cta-section {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          text-align: center;
        }

        .cta-content {
          max-width: 550px;
          margin: 0 auto;
        }

        .cta-content h2 {
          color: white;
          margin-bottom: 12px;
          font-size: 2rem;
        }

        .cta-content p {
          margin-bottom: 25px;
          opacity: 0.95;
          font-size: 1.05rem;
        }

        .btn-white {
          background: white;
          color: #059669;
        }

        .btn-white:hover {
          background: #f8f9fa;
        }

        @media (max-width: 992px) {
          .hero h1 {
            font-size: 3rem;
          }

          .hero-subtitle {
            font-size: 1.2rem;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .hero {
            min-height: 500px;
          }

          .hero h1 {
            font-size: 2.2rem;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .grid-3,
          .grid-4 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function getServiceIcon(name) {
  const icons = {
    '24/7 Emergency': '🚑',
    'Online Consultation': '💻',
    'Health Checkups': '📋',
    'Diagnostic Lab': '🔬',
    'Pharmacy': '💊',
    'Ambulance Service': '📞',
  };
  return icons[name] || '🏥';
}

function getDeptImage(name) {
  const images = {
    'Cardiology': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
    'Neurology': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80',
    'Orthopedics': 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400&q=80',
    'Pediatrics': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80',
    'Gynecology': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&q=80',
    'Dermatology': 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=400&q=80',
    'Ophthalmology': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80',
    'ENT': 'https://images.unsplash.com/photo-1516574187841-69301976e499?w=400&q=80',
    'Dental': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&q=80',
    'General Medicine': 'https://images.unsplash.com/photo-1576091160550-217358c7e618?w=400&q=80',
  };
  return images[name] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80';
}

function getDoctorImage() {
  return 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80';
}

export default Home;
