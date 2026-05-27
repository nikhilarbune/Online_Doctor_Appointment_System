import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.jsx';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments/');
      setDepartments(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoading(false);
    }
  };

  const departmentIcons = {
    Cardiology: '❤️',
    Neurology: '🧠',
    Orthopedics: '🦴',
    Pediatrics: '👶',
    Gynecology: '👩',
    Dermatology: '🧴',
    Ophthalmology: '👁️',
    ENT: '👂',
    Dental: '🦷',
    'General Medicine': '🩺',
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="departments-page">
      <section className="page-header">
        <div className="container">
          <h1>Our Departments</h1>
          <p>Specialized care across multiple medical disciplines</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {departments.map((dept) => (
              <div key={dept.id} className="card department-card">
                <div className="card-body">
                  <div className="dept-icon">
                    {departmentIcons[dept.name] || '🏥'}
                  </div>
                  <h3>{dept.name}</h3>
                  <p>{dept.description}</p>
                  <div className="dept-stats">
                    <span className="stat">
                      👨‍⚕️ {dept.doctors_count || 0} Doctors
                    </span>
                  </div>
                  <div className="dept-actions">
                    <Link to="/appointment" className="btn btn-primary">
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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

        .department-card {
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .department-card:hover {
          transform: translateY(-5px);
        }

        .dept-icon {
          font-size: 5rem;
          margin-bottom: 15px;
        }

        .department-card h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .department-card p {
          color: #666;
          margin-bottom: 15px;
        }

        .dept-stats {
          padding: 15px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          margin-bottom: 15px;
        }

        .dept-stats .stat {
          color: #007bff;
          font-weight: 600;
        }

        .dept-actions {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

export default Departments;
