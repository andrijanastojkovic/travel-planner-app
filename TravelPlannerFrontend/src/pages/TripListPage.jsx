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

  const [successMessage, setSuccessMessage] = useState('');

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

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

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

      showSuccess('Plan uspešno kreiran.');
      loadTrips();
    } catch (err) {
      setFormError(
        err.response?.data?.message || 'Kreiranje plana nije uspelo.'
      );
    }
  };

  const handleDeleteTrip = async (tripId, tripName) => {
    const confirmed = window.confirm(
      `Da li ste sigurni da želite da obrišete plan "${tripName}"? Ova akcija je nepovratna.`
    );
    if (!confirmed) return;

    try {
      await tripPlanService.deleteTripPlan(tripId);
      showSuccess('Plan uspešno obrisan.');
      loadTrips();
    } catch (err) {
      setError('Neuspešno brisanje plana.');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header-centered">
          <div>
            <h1>Moji planovi putovanja</h1>
            <p>Planirajte, organizujte i delite svoja putovanja</p>
          </div>
          <div className="user-pill">
            <span>{user?.name}</span>
            {user?.role === 'Admin' && <Link to="/admin">Admin panel</Link>}
            <button className="btn-small" onClick={logout}>Odjavi se</button>
          </div>
        </div>

        <div className="action-row">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Otkaži' : '+ Novi plan'}
          </button>
        </div>

        {showForm && (
          <section className="form-section">
            <h2>Novi plan putovanja</h2>
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
                <label htmlFor="startDate">Datum polaska</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate">Datum povratka</label>
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

              {formError && <p className="error-text">{formError}</p>}

              <button type="submit" className="btn-primary">Sačuvaj plan</button>
            </form>
          </section>
        )}

        {loading && <p>Učitavanje...</p>}
        {error && <p className="error-text">{error}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        {!loading && trips.length === 0 && <p>Nemate još planova putovanja.</p>}

        <div className="trip-list">
          {trips.map((trip) => (
            <div key={trip.id} className="card trip-card">
              <Link to={`/trips/${trip.id}`} className="trip-card-link">
                <div className="trip-card-name">{trip.name}</div>
                <div className="trip-card-dates">
                  {trip.startDate?.slice(0, 10)} — {trip.endDate?.slice(0, 10)}
                </div>
                <div className="trip-card-budget">{trip.budget} €</div>
              </Link>
              <button
                className="btn-small btn-danger"
                onClick={() => handleDeleteTrip(trip.id, trip.name)}
              >
                Obriši
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TripListPage;