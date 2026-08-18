import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as shareService from '../services/shareService';

function SharedTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    load();
  }, [token]);

  if (loading) return <p>Učitavanje...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!trip) return null;

  return (
    <div>
      <p>
        <em>
          Pregledate deljeni plan putovanja ({trip.accessType === 'EDIT' ? 'pregled i uređivanje' : 'samo pregled'})
        </em>
      </p>

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
          {trip.destinations.map((d) => (
            <li key={d.id}>
              <strong>{d.name}</strong> — {d.location} (
              {d.arrivalDate?.slice(0, 10)} — {d.departureDate?.slice(0, 10)})
            </li>
          ))}
        </ul>
      </section>

      <hr />

      <section>
        <h2>Aktivnosti</h2>
        <ul>
          {trip.activities.map((a) => (
            <li key={a.id}>
              <strong>{a.name}</strong> — {a.date?.slice(0, 10)}{' '}
              {a.time ? `u ${a.time}` : ''} ({a.status})
            </li>
          ))}
        </ul>
      </section>

      <hr />

      <section>
        <h2>Checklist</h2>
        <ul>
          {trip.checklistItems.map((item) => (
            <li key={item.id}>
              <span style={{ textDecoration: item.isDone ? 'line-through' : 'none' }}>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p>
        <Link to="/login">Prijavite se</Link> da napravite sopstveni plan putovanja.
      </p>
    </div>
  );
}

export default SharedTripPage;