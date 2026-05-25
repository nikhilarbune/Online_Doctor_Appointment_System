import { useState, useEffect } from 'react';
import api from '../api/axiosTemp';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/');
      setServices(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const serviceIcons = {
    '24/7 Emergency': '🚑',
    'Online Consultation': '💻',
    'Health Checkups': '📋',
    'Diagnostic Lab': '🔬',
    Pharmacy: '💊',
    'Ambulance Service': '🚨',
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive healthcare services for you and your family</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {services.map((service) => (
              <div key={service.id} className="card service-card">
                <div className="card-body">
                  <div className="service-icon">
                    {serviceIcons[service.name] || '🏥'}
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Jupiter Hospital?</h2>
          </div>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Expert Doctors</h3>
              <p>Highly qualified and experienced medical professionals</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔬</div>
              <h3>Advanced Technology</h3>
              <p>State-of-the-art medical equipment and facilities</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏆</div>
              <h3>Quality Care</h3>
              <p>Internationally accredited healthcare services</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💝</div>
              <h3>Patient First</h3>
              <p>Compassionate care focused on patient well-being</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
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
          opacity: 0.9;
        }

        .service-card {
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .service-card:hover {
          transform: translateY(-5px);
        }

        .service-icon {
          font-size: 4rem;
          margin-bottom: 15px;
        }

        .service-card h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .service-card p {
          color: #666;
        }

        .bg-light {
          background: #f8f9fa;
        }

        .section-title {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-title h2 {
          font-size: 2rem;
          color: #333;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 30px;
        }

        .feature {
          text-align: center;
          padding: 20px;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .feature h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .feature p {
          color: #666;
        }

        @media (max-width: 992px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Services;
