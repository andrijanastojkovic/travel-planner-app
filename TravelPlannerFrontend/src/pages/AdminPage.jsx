import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../services/authService';
import * as tripPlanService from '../services/tripPlanService';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [usersData, plansData] = await Promise.all([
        authService.getAllUsers(),
        tripPlanService.getAllTripPlans(),
      ]);
      setUsers(usersData);
      setPlans(plansData);
    } catch (err) {
      setError('Nemate dozvolu za pristup ovoj stranici.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `Da li ste sigurni da želite da obrišete korisnika "${userName}"?`
    );
    if (!confirmed) return;

    try {
      await authService.deleteUser(userId);
      showSuccess('Korisnik uspešno obrisan.');
      loadAll();
    } catch (err) {
      setError('Neuspešno brisanje korisnika.');
    }
  };

  const handleDeletePlan = async (planId, planName) => {
    const confirmed = window.confirm(
      `Da li ste sigurni da želite da obrišete plan "${planName}"?`
    );
    if (!confirmed) return;

    try {
      await tripPlanService.deleteTripPlan(planId);
      showSuccess('Plan uspešno obrisan.');
      loadAll();
    } catch (err) {
      setError('Neuspešno brisanje plana.');
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await tripPlanService.createTripPlanForUser(
        { name, description, startDate, endDate, budget: parseFloat(budget) || 0, notes },
        targetUserId
      );
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setBudget('');
      setNotes('');
      setTargetUserId('');
      setShowCreateForm(false);
      showSuccess('Plan uspešno kreiran za korisnika.');
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Neuspešno kreiranje plana.');
    }
  };

  const getUserName = (userId) => {
    const u = users.find((user) => user.id === userId);
    return u ? u.name : userId;
  };

  if (loading) return <p>Učitavanje...</p>;
  if (error && users.length === 0) return <p className="error-text">{error}</p>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/trips" className="back-link">← Nazad na planove</Link>
        <h1>Administracija</h1>

        {error && <p className="error-text">{error}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <section>
          <h2>Korisnici</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>Ime</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>Uloga</th>
                <th style={{ textAlign: 'left', padding: '10px' }}></th>
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
                  <td style={{ padding: '10px' }}>
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDeleteUser(u.id, u.name)}
                    >
                      Obriši
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Svi planovi putovanja</h2>

          <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Otkaži' : '+ Kreiraj plan za korisnika'}
          </button>

          {showCreateForm && (
            <form onSubmit={handleCreatePlan} style={{ marginTop: '16px' }}>
              <div>
                <label htmlFor="targetUser">Korisnik</label>
                <select
                  id="targetUser"
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  required
                >
                  <option value="">-- Izaberi korisnika --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="name">Naziv putovanja</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="description">Opis</label>
                <input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <label htmlFor="startDate">Datum polaska</label>
                <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="endDate">Datum povratka</label>
                <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="budget">Budžet</label>
                <input id="budget" type="number" min="0" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>
              <div>
                <label htmlFor="notes">Napomene</label>
                <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary">Sačuvaj plan</button>
            </form>
          )}

          <ul style={{ marginTop: '20px' }}>
            {plans.map((plan) => (
              <li key={plan.id}>
                <div>
                  <strong>{plan.name}</strong> — vlasnik: {getUserName(plan.userId)}
                  <div className="card-meta">
                    {plan.startDate?.slice(0, 10)} — {plan.endDate?.slice(0, 10)} · {plan.budget} €
                  </div>
                </div>
                <div>
                  <Link to={`/trips/${plan.id}`} className="btn-small">Uredi</Link>
                  <button className="btn-small btn-danger" onClick={() => handleDeletePlan(plan.id, plan.name)}>
                    Obriši
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AdminPage;