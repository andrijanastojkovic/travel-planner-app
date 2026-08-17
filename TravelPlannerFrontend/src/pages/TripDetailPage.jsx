import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as tripPlanService from '../services/tripPlanService';
import * as destinationService from '../services/destinationService';
import * as activityService from '../services/activityService';
import * as checklistService from '../services/checklistService';

function TripDetailPage() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [destName, setDestName] = useState('');
  const [destLocation, setDestLocation] = useState('');
  const [destArrival, setDestArrival] = useState('');
  const [destDeparture, setDestDeparture] = useState('');

  const [actName, setActName] = useState('');
  const [actDate, setActDate] = useState('');
  const [actTime, setActTime] = useState('');
  const [actLocation, setActLocation] = useState('');
  const [actCost, setActCost] = useState('');

  const [checklistName, setChecklistName] = useState('');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [tripData, destData, actData, checkData] = await Promise.all([
        tripPlanService.getTripPlan(id),
        destinationService.getDestinations(id),
        activityService.getActivities(id),
        checklistService.getChecklistItems(id),
      ]);
      setTrip(tripData);
      setDestinations(destData);
      setActivities(actData);
      setChecklistItems(checkData);
    } catch (err) {
      setError('Neuspešno učitavanje plana.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  const handleAddDestination = async (e) => {
    e.preventDefault();
    await destinationService.createDestination(id, {
      name: destName,
      location: destLocation,
      arrivalDate: destArrival,
      departureDate: destDeparture,
    });
    setDestName('');
    setDestLocation('');
    setDestArrival('');
    setDestDeparture('');
    const destData = await destinationService.getDestinations(id);
    setDestinations(destData);
  };

  const handleDeleteDestination = async (destId) => {
    await destinationService.deleteDestination(id, destId);
    setDestinations(destinations.filter((d) => d.id !== destId));
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    await activityService.createActivity(id, {
      name: actName,
      date: actDate,
      time: actTime ? `${actTime}:00` : null,
      location: actLocation,
      estimatedCost: parseFloat(actCost) || 0,
      status: 'Planirano',
    });
    setActName('');
    setActDate('');
    setActTime('');
    setActLocation('');
    setActCost('');
    const actData = await activityService.getActivities(id);
    setActivities(actData);
  };

  const handleDeleteActivity = async (actId) => {
    await activityService.deleteActivity(id, actId);
    setActivities(activities.filter((a) => a.id !== actId));
  };

  const handleAddChecklistItem = async (e) => {
    e.preventDefault();
    await checklistService.createChecklistItem(id, { name: checklistName });
    setChecklistName('');
    const checkData = await checklistService.getChecklistItems(id);
    setChecklistItems(checkData);
  };

  const handleToggleChecklistItem = async (itemId) => {
    const updated = await checklistService.toggleChecklistItem(id, itemId);
    setChecklistItems(
      checklistItems.map((item) => (item.id === itemId ? updated : item))
    );
  };

  const handleDeleteChecklistItem = async (itemId) => {
    await checklistService.deleteChecklistItem(id, itemId);
    setChecklistItems(checklistItems.filter((item) => item.id !== itemId));
  };

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!trip) return null;

  return (
    <div>
      <Link to="/trips">← Nazad na listu</Link>

      <h1>{trip.name}</h1>
      <p>{trip.description}</p>
      <p>
        {trip.startDate?.slice(0, 10)} — {trip.endDate?.slice(0, 10)}
      </p>
      <p>Budžet: {trip.budget} €</p>
      <p>Napomene: {trip.notes}</p>

      <hr />

      <section>
        <h2>Destinacije</h2>
        <ul>
          {destinations.map((d) => (
            <li key={d.id}>
              <strong>{d.name}</strong> — {d.location} (
              {d.arrivalDate?.slice(0, 10)} — {d.departureDate?.slice(0, 10)})
              <button onClick={() => handleDeleteDestination(d.id)}>Obriši</button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddDestination}>
          <input
            placeholder="Naziv"
            value={destName}
            onChange={(e) => setDestName(e.target.value)}
            required
          />
          <input
            placeholder="Lokacija"
            value={destLocation}
            onChange={(e) => setDestLocation(e.target.value)}
          />
          <input
            type="date"
            value={destArrival}
            onChange={(e) => setDestArrival(e.target.value)}
            required
          />
          <input
            type="date"
            value={destDeparture}
            onChange={(e) => setDestDeparture(e.target.value)}
            required
          />
          <button type="submit">Dodaj destinaciju</button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Aktivnosti</h2>
        <ul>
          {activities.map((a) => (
            <li key={a.id}>
              <strong>{a.name}</strong> — {a.date?.slice(0, 10)}{' '}
              {a.time ? `u ${a.time}` : ''} ({a.status}) — {a.estimatedCost} €
              <button onClick={() => handleDeleteActivity(a.id)}>Obriši</button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddActivity}>
          <input
            placeholder="Naziv aktivnosti"
            value={actName}
            onChange={(e) => setActName(e.target.value)}
            required
          />
          <input
            type="date"
            value={actDate}
            onChange={(e) => setActDate(e.target.value)}
            required
          />
          <input
            type="time"
            value={actTime}
            onChange={(e) => setActTime(e.target.value)}
          />
          <input
            placeholder="Lokacija"
            value={actLocation}
            onChange={(e) => setActLocation(e.target.value)}
          />
          <input
            type="number"
            placeholder="Procenjeni trošak"
            value={actCost}
            onChange={(e) => setActCost(e.target.value)}
          />
          <button type="submit">Dodaj aktivnost</button>
        </form>
      </section>

      <hr />

      <section>
        <h2>Checklist</h2>
        <ul>
          {checklistItems.map((item) => (
            <li key={item.id}>
              <input
                type="checkbox"
                checked={item.isDone}
                onChange={() => handleToggleChecklistItem(item.id)}
              />
              <span
                style={{
                  textDecoration: item.isDone ? 'line-through' : 'none',
                }}
              >
                {item.name}
              </span>
              <button onClick={() => handleDeleteChecklistItem(item.id)}>Obriši</button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddChecklistItem}>
          <input
            placeholder="Nova stavka"
            value={checklistName}
            onChange={(e) => setChecklistName(e.target.value)}
            required
          />
          <button type="submit">Dodaj stavku</button>
        </form>
      </section>
    </div>
  );
}

export default TripDetailPage;