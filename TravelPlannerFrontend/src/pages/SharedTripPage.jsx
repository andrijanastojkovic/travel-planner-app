import { useState, useEffect, act } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as shareService from '../services/shareService';

function SharedTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [destName, setDestName] = useState('');
  const [destLocation, setDestLocation] = useState('');
  const [destArrival, setDestArrival] = useState('');
  const [destDeparture, setDestDeparture] = useState('');

  const [actName, setActName] = useState('');
  const [actDate, setActDate] = useState('');
  const [actTime, setActTime] = useState('');
  const [actLocation, setActLocation] = useState('');
  const [actCost, setActCost] = useState('');
  const [actStatus, setActStatus] = useState('Planirano');

  const [checklistName, setChecklistName] = useState('');

  const load = async () => {
    try {
      const data = await shareService.getSharedTripPlan(token);
      setTrip(data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Link za deljenje nije validan ili je istekao.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const isEdit = trip?.accessType === 'EDIT';

  const handleAddDestination = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      await shareService.createDestinationViaShare(token, trip.id, {
        name: destName,
        location: destLocation,
        arrivalDate: destArrival,
        departureDate: destDeparture,
      });
      setDestName('');
      setDestLocation('');
      setDestArrival('');
      setDestDeparture('');
      load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Greška pri dodavanju destinacije.');
    }
  };

  const handleDeleteDestination = async (id) => {
    setActionError('');
    try {
      await shareService.deleteDestinationViaShare(token, trip.id, id);
      load();
    } catch (err) {
      setActionError('Greška pri brisanju destinacije.');
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      await shareService.createActivityViaShare(token, trip.id, {
        name: actName,
        date: actDate,
        time: actTime ? `${actTime}:00` : null,
        location: actLocation,
        estimatedCost: parseFloat(actCost) || 0,
        status: actStatus,
      });
      setActName('');
      setActDate('');
      setActTime('');
      setActLocation('');
      setActCost('');
      setActStatus('Planirano');
      load();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Greška pri dodavanju aktivnosti.');
    }
  };

  const handleDeleteActivity = async (id) => {
    setActionError('');
    try {
      await shareService.deleteActivityViaShare(token, trip.id, id);
      load();
    } catch (err) {
      setActionError('Greška pri brisanju aktivnosti.');
    }
  };

  const handleAddChecklistItem = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      await shareService.createChecklistItemViaShare(token, trip.id, { name: checklistName });
      setChecklistName('');
      load();
    } catch (err) {
      setActionError('Greška pri dodavanju stavke.');
    }
  };

  const handleToggleChecklistItem = async (id) => {
    setActionError('');
    try {
      await shareService.toggleChecklistItemViaShare(token, trip.id, id);
      load();
    } catch (err) {
      setActionError('Greška pri izmeni stavke.');
    }
  };

  const handleDeleteChecklistItem = async (id) => {
    setActionError('');
    try {
      await shareService.deleteChecklistItemViaShare(token, trip.id, id);
      load();
    } catch (err) {
      setActionError('Greška pri brisanju stavke.');
    }
  };

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!trip) return null;

  return (
    <div className="page">
      <div className="container">
        <p>
          <em>
            Pregledate deljeni plan putovanja ({isEdit ? 'pregled i uređivanje' : 'samo pregled'})
          </em>
        </p>

      <h1>{trip.name}</h1>
      <p>{trip.description}</p>
      <p>
        {trip.startDate?.slice(0, 10)} — {trip.endDate?.slice(0, 10)}
      </p>
      <p>Budžet: {trip.budget} €</p>
      <p>Napomene: {trip.notes}</p>

      {actionError && <p className="error-text">{actionError}</p>}

      <section>
        <h2>Destinacije</h2>
        <ul>
          {trip.destinations.map((d) => (
            <li key={d.id}>
              <strong>{d.name}</strong> — {d.location} (
              {d.arrivalDate?.slice(0, 10)} — {d.departureDate?.slice(0, 10)})
              {isEdit && (
                <button className="btn-small btn-danger" onClick={() => handleDeleteDestination(d.id)}>Obriši</button>
              )}
            </li>
          ))}
        </ul>

        {isEdit && (
          <form onSubmit={handleAddDestination}>
            <input placeholder="Naziv" value={destName} onChange={(e) => setDestName(e.target.value)} required />
            <input placeholder="Lokacija" value={destLocation} onChange={(e) => setDestLocation(e.target.value)} />
            <input type="date" value={destArrival} onChange={(e) => setDestArrival(e.target.value)} required />
            <input type="date" value={destDeparture} onChange={(e) => setDestDeparture(e.target.value)} required />
            <button type="submit" className="btn-primary">Dodaj destinaciju</button>
          </form>
        )}
      </section>

      <hr />

      <section>
        <h2>Aktivnosti</h2>
        <ul>
          {trip.activities.map((a) => (
            <li key={a.id}>
              <strong>{a.name}</strong> — {a.date?.slice(0, 10)}{' '}
              {a.time ? `u ${a.time}` : ''} ({a.status}) — {a.estimatedCost} €
              {isEdit && (
                <button className="btn-small btn-danger" onClick={() => handleDeleteActivity(a.id)}>Obriši</button>
              )}
            </li>
          ))}
        </ul>
        {isEdit && (
          <form onSubmit={handleAddActivity}>
            <input placeholder="Naziv aktivnosti" value={actName} onChange={(e) => setActName(e.target.value)} required />
            <input type="date" value={actDate} onChange={(e) => setActDate(e.target.value)} required />
            <input type="time" value={actTime} onChange={(e) => setActTime(e.target.value)} />
            <input placeholder="Lokacija" value={actLocation} onChange={(e) => setActLocation(e.target.value)} />
            <input type="number" placeholder="Procenjeni trošak" value={actCost} onChange={(e) => setActCost(e.target.value)} />
            <select value={actStatus} onChange={(e) => setActStatus(e.target.value)}>
              <option value="Planirano">Planirano</option>
              <option value="Rezervisano">Rezervisano</option>
              <option value="Zavrseno">Završeno</option>
              <option value="Otkazano">Otkazano</option>
            </select>
            <button type="submit" className="btn-primary">Dodaj aktivnost</button>
          </form>
        )}
      </section>

      <hr />

      <section>
        <h2>Checklist</h2>
        <ul>
          {trip.checklistItems.map((item) => (
            <li key={item.id} className="checklist-item">
                <input
                  type="checkbox"
                  className="checklist-checkbox"
                  checked={item.isDone}
                  disabled={!isEdit}
                  onChange={() => handleToggleChecklistItem(item.id)}
            />
            <span style={{ textDecoration: item.isDone ? 'line-through' : 'none' }}>
              {item.name}
            </span>
            {isEdit && (
              <button className="btn-small btn-danger" onClick={() => handleDeleteChecklistItem(item.id)}>Obriši</button>
            )}
            </li>
          ))}
        </ul>

        {isEdit && (
          <form onSubmit={handleAddChecklistItem}>
            <input placeholder="Nova stavka" value={checklistName} onChange={(e) => setChecklistName(e.target.value)} required />
            <button type="submit">Dodaj stavku</button>
          </form>
        )}
      </section>

      <p>
        <Link to="/login">Prijavite se</Link> da napravite sopstveni plan putovanja.
      </p>
    </div>
  </div>  

  );
}

export default SharedTripPage;