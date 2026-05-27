import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.jsx';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDept, setFilterDept] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, deptRes] = await Promise.all([
        api.get('/doctors/'),
        api.get('/departments/'),
      ]);
      setDoctors(docRes.data);
      setDepartments(deptRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesDept = filterDept ? doctor.specialization === parseInt(filterDept) : true;
    const matchesSearch = searchTerm
      ? doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization_name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDept && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="doctors-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Doctors</h1>
          <p>Find the right specialist for your healthcare needs</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Department</label>
              <select
                className="form-control"
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-3">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="card doctor-card">
                <div className="card-body">
                  <div className="doctor-avatar">👨‍⚕️</div>
                  <h3>Dr. {doctor.name}</h3>
                  <p className="doctor-specialty">{doctor.specialization_name}</p>
                  <p className="doctor-qualification">{doctor.qualification}</p>
                  <p className="doctor-bio">{doctor.bio}</p>
                  <div className="doctor-details">
                    <div className="detail">
                      <span className="icon">📅</span>
                      <span>{doctor.experience_years} years exp.</span>
                    </div>
                    <div className="detail">
                      <span className="icon">💰</span>
                      <span>₹{doctor.consultation_fee}</span>
                    </div>
                    <div className="detail">
                      <span className="icon">🕐</span>
                      <span>{doctor.available_time}</span>
                    </div>
                    <div className="detail">
                      <span className="icon">📆</span>
                      <span>{doctor.available_days}</span>
                    </div>
                  </div>
                  <div className="doctor-contact">
                    <a href={`tel:${doctor.phone}`} className="contact-link">
                      📞 {doctor.phone}
                    </a>
                    <a href={`mailto:${doctor.email}`} className="contact-link">
                      ✉️ Email
                    </a>
                  </div>
                  <div className="doctor-actions">
                    <Link to="/appointment" className="btn btn-primary">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="no-results">
              <p>No doctors found matching your criteria.</p>
            </div>
          )}
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

        .filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .filter-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .doctor-card {
          text-align: center;
        }

        .doctor-avatar {
          font-size: 5rem;
          margin-bottom: 15px;
        }

        .doctor-specialty {
          color: #007bff;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .doctor-qualification {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 10px;
        }

        .doctor-bio {
          color: #333;
          font-size: 0.95rem;
          margin-bottom: 15px;
        }

        .doctor-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin: 15px 0;
          padding: 15px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }

        .detail {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #666;
        }

        .detail .icon {
          font-size: 1.1rem;
        }

        .doctor-contact {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .contact-link {
          color: #007bff;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .contact-link:hover {
          text-decoration: underline;
        }

        .doctor-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        @media (max-width: 768px) {
          .doctor-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Doctors;
