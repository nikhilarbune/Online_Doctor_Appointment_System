function About() {
  return (
    <div className="about-page">
      <section className="page-header">
        <div className="container">
          <h1>About DOCSURE</h1>
          <p>Excellence in Healthcare Since 2000</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Mission</h2>
              <p>
                At DOCSURE, we are committed to providing the highest
                quality healthcare services with compassion, dignity, and respect
                for all our patients. Our mission is to be a leader in medical
                excellence, research, and innovation.
              </p>
              <p>
                We believe in a patient-centered approach, where every individual
                receives personalized care tailored to their specific needs. Our
                state-of-the-art facilities and experienced medical professionals
                work together to ensure the best possible outcomes.
              </p>
            </div>

            <div className="about-image">
              <div className="image-placeholder">🏥</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose DOCSURE?</h2>
            <p>Discover what makes us special</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Expert Medical Team</h3>
              <p>
                Our hospital boasts a team of highly qualified doctors, surgeons,
                and healthcare professionals with years of experience.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Advanced Technology</h3>
              <p>
                We use cutting-edge medical technology and equipment to ensure
                accurate diagnosis and effective treatment.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Accredited Excellence</h3>
              <p>
                DOCSURE is accredited by national and international
                healthcare organizations for quality standards.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚑</div>
              <h3>24/7 Emergency Care</h3>
              <p>
                Our emergency department is equipped to handle any medical
                crisis round the clock with immediate response.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Compassionate Care</h3>
              <p>
                We treat every patient with empathy, respect, and personalized
                attention throughout their healthcare journey.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏋️</div>
              <h3>Comprehensive Services</h3>
              <p>
                From routine check-ups to complex surgeries, we offer a wide
                range of medical services under one roof.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats">
            <div className="stat-card">
              <div className="stat-number">25+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">20+</div>
              <div className="stat-label">Departments</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500K+</div>
              <div className="stat-label">Patients Treated</div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .page-header {
          background: linear-gradient(135deg, #007bff 0%, #00c6ff 100%);
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

        .about-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }

        .about-text h2 {
          color: #333;
          margin-bottom: 20px;
        }

        .about-text p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 15px;
        }

        .about-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-placeholder {
          font-size: 10rem;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          width: 300px;
          height: 300px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

        .section-title p {
          color: #666;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .feature-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .feature-card h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }

        .stat-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          color: #007bff;
        }

        .stat-label {
          color: #666;
          margin-top: 5px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 992px) {
          .about-content {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 576px) {
          .features-grid {
            grid-template-columns: 1fr;
          }

          .image-placeholder {
            font-size: 6rem;
            width: 200px;
            height: 200px;
          }

          .stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default About;
