import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../services/authService';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await authService.getAllUsers();
        setUsers(data);
      } catch (err) {
        setError('Nemate dozvolu za pristup ovoj stranici.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/trips" className="back-link">← Nazad na planove</Link>
        <h1>Administracija — svi korisnici</h1>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Ime</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Uloga</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Registrovan</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px' }}>{u.name}</td>
                <td style={{ padding: '10px' }}>{u.email}</td>
                <td style={{ padding: '10px' }}>
                  <span className="badge">{u.role}</span>
                </td>
                <td style={{ padding: '10px' }}>{u.createdAt?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPage;