import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as tripPlanService from '../services/tripPlanService';
import { useAuth } from '../context/AuthContext';

function TripListPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const { user, logout } = useAuth();

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await tripPlanService.getTripPlans();
      setTrips(data);
    } catch (err) {
      setError('Neuspešno učitavanje planova.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await tripPlanService.createTripPlan({
        name,
        description,
        startDate,
        endDate,
        budget: parseFloat(budget) || 0,
        notes,
      });

      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setBudget('');
      setNotes('');
      setShowForm(false);

      loadTrips();
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Kreiranje plana nije uspelo.'
      );
    }
  };

  return (
    <div>
      <header>
        <h1>Moji planovi putovanja</h1>
        <p>
          Prijavljen(a): {user?.name} ({user?.email})
          <button onClick={logout}>Odjavi se</button>
        </p>
      </header>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Otkaži' : '+ Novi plan'}
      </button>

      {showForm && (
        <form onSubmit={handleCreate}>
          <div>
            <label htmlFor="name">Naziv putovanja</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Opis</label>
            <input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="startDate">Početni datum</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="endDate">Krajnji datum</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="budget">Budžet</label>
            <input
              id="budget"
              type="number"
              min="0"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="notes">Napomene</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {formError && <p style={{ color: 'red' }}>{formError}</p>}

          <button type="submit">Sačuvaj plan</button>
        </form>
      )}

      {loading && <p>Učitavanje...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && trips.length === 0 && <p>Nemate još planova putovanja.</p>}

      <ul>
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link to={`/trips/${trip.id}`}>
              <strong>{trip.name}</strong>
            </Link>
            <p>
              {trip.startDate?.slice(0, 10)} — {trip.endDate?.slice(0, 10)}
            </p>
            <p>Budžet: {trip.budget} €</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TripListPage;