import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as tripPlanService from '../services/tripPlanService';
import * as destinationService from '../services/destinationService';
import * as activityService from '../services/activityService';
import * as checklistService from '../services/checklistService';
import * as expenseService from '../services/expenseService';
import * as shareService from '../services/shareService';

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
  const [editingDestId, setEditingDestId] = useState(null);

  const [actName, setActName] = useState('');
  const [actDate, setActDate] = useState('');
  const [actTime, setActTime] = useState('');
  const [actLocation, setActLocation] = useState('');
  const [actCost, setActCost] = useState('');
  const [actStatus, setActStatus] = useState('Planirano');
  const [editingActId, setEditingActId] = useState(null);

  const [checklistName, setChecklistName] = useState('');

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalSpent: 0, expenseCount: 0 });

  const [expName, setExpName] = useState('');
  const [expCategory, setExpCategory] = useState('Ostalo');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('');
  const [expDescription, setExpDescription] = useState('');

  const [shareLink, setShareLink] = useState('');
  const [shareAccessType, setShareAccessType] = useState('VIEW');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [tripData, destData, actData, checkData, expData, summaryData] = await Promise.all([
        tripPlanService.getTripPlan(id),
        destinationService.getDestinations(id),
        activityService.getActivities(id),
        checklistService.getChecklistItems(id),
        expenseService.getExpenses(id),
        expenseService.getExpenseSummary(id),
      ]);
      setTrip(tripData);
      setDestinations(destData);
      setActivities(actData);
      setChecklistItems(checkData);
      setExpenses(expData);
      setSummary(summaryData);
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

  const startEditDestination = (dest) => {
    setEditingDestId(dest.id);
    setDestName(dest.name);
    setDestLocation(dest.location);
    setDestArrival(dest.arrivalDate?.slice(0, 10));
    setDestDeparture(dest.departureDate?.slice(0, 10));
  };

  const cancelEditDestination = () => {
    setEditingDestId(null);
    setDestName('');
    setDestLocation('');
    setDestArrival('');
    setDestDeparture('');
  };

  const handleSaveDestination = async (e) => {
    e.preventDefault();

    const payload = {
      name: destName,
      location: destLocation,
      arrivalDate: destArrival,
      departureDate: destDeparture,
    };

    if (editingDestId) {
      await destinationService.updateDestination(id, editingDestId, payload);
    } else {
      await destinationService.createDestination(id, payload);
    }

    cancelEditDestination();
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

  const startEditActivity = (act) => {
    setEditingActId(act.id);
    setActName(act.name);
    setActDate(act.date?.slice(0, 10));
    setActTime(act.time ? act.time.slice(0, 5) : '');
    setActLocation(act.location || '');
    setActCost(act.estimatedCost);
    setActStatus(act.status);
  };

  const cancelEditActivity = () => {
    setEditingActId(null);
    setActName('');
    setActDate('');
    setActTime('');
    setActLocation('');
    setActCost('');
    setActStatus('Planirano');
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();

    const payload = {
      name: actName,
      date: actDate,
      time: actTime ? `${actTime}:00` : null,
      location: actLocation,
      estimatedCost: parseFloat(actCost) || 0,
      status: actStatus,
    };

    if (editingActId) {
      await activityService.updateActivity(id, editingActId, payload);
    } else {
      await activityService.createActivity(id, payload);
    }

    cancelEditActivity();
    const actData = await activityService.getActivities(id);
    setActivities(actData);
  }

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

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await expenseService.createExpense(id, {
    tripPlanId: id,
    name: expName,
    category: expCategory,
    amount: parseFloat(expAmount) || 0,
    date: expDate,
    description: expDescription,
    });
    setExpName('');
    setExpCategory('Ostalo');
    setExpAmount('');
    setExpDate('');
    setExpDescription('');
    const expData = await expenseService.getExpenses(id);
    const summaryData = await expenseService.getExpenseSummary(id);
    setExpenses(expData);
    setSummary(summaryData);
  };

  const handleDeleteExpense = async (expId) => {
    await expenseService.deleteExpense(id, expId);
    const expData = await expenseService.getExpenses(id);
    const summaryData = await expenseService.getExpenseSummary(id);
    setExpenses(expData);
    setSummary(summaryData);
  };

  const handleCreateShareLink = async () => {
    const data = await shareService.createShareToken(id, shareAccessType);
    const link = `${window.location.origin}/share/${data.token}`;
    setShareLink(link);
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

      <section>
        <h2>Deljenje</h2>
        <select
          value={shareAccessType}
          onChange={(e) => setShareAccessType(e.target.value)}
        >
          <option value="VIEW">Samo pregled</option>
          <option value="EDIT">Pregled i uređivanje</option>
        </select>
        <button onClick={handleCreateShareLink}>Generiši link za deljenje</button>

        {shareLink && (
          <p>
            Link: <input type="text" readOnly value={shareLink} style={{ width: '400px' }} />
            <button onClick={() => navigator.clipboard.writeText(shareLink)}>
            Kopiraj
            </button>
          </p>
        )}
      </section>

      <hr />

      <section>
        <h2>Destinacije</h2>
        <ul>
          {destinations.map((d) => (
            <li key={d.id}>
              <strong>{d.name}</strong> — {d.location} (
              {d.arrivalDate?.slice(0, 10)} — {d.departureDate?.slice(0, 10)})
              <div>
                <button className="btn-small" onClick={() => startEditDestination(d)}>Izmeni</button>
                <button className="btn-small btn-danger" onClick={() => handleDeleteDestination(d.id)}>Obriši</button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSaveDestination}>
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
          <button type="submit" className="btn-primary">
            {editingDestId ? 'Sačuvaj izmene' : 'Dodaj destinaciju'}
          </button>
          {editingDestId && (
            <button type="button" onClick={cancelEditDestination}>Otkaži</button>
          )}
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
              <div>
                <button className="btn-small" onClick={() => startEditActivity(a)}>Izmeni</button>
                <button className="btn-small btn-danger" onClick={() => handleDeleteActivity(a.id)}>Obriši</button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSaveActivity}>
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
          <select value ={actStatus} onChange={(e) => setActStatus(e.target.value)}>
            <option value="Planirano">Planirano</option>
            <option value="Rezervisano">Rezervisano</option>
            <option value="Zavrseno">Završeno</option>
            <option value="Otkazano">Otkazano</option>
          </select>
          <button type="submit" className="btn-primary">
            {editingActId ? 'Sačuvaj izmene' : 'Dodaj aktivnost'}
          </button>
          {editingActId && (
            <button type="button" onClick={cancelEditActivity}>Otkaži</button>
          )}
        </form>
      </section>

      <hr />

      <section>
        <h2>Checklist</h2>
        <ul>
          {checklistItems.map((item) => (
            <li key={item.id} className="checklist-item">
              <input
                type="checkbox"
                className="checklist-checkbox"
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
              <button className="btn-small btn-danger" onClick={() => handleDeleteChecklistItem(item.id)}>Obriši</button>
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

      <hr />

      <section>
        <h2>Troškovi</h2>
        <p>
          Ukupno potrošeno: <strong>{summary.totalSpent} €</strong>
          {' '}(planirani budžet: {trip.budget} €, preostalo: {(trip.budget - summary.totalSpent).toFixed(2)} €)
        </p>

        <ul>
          {expenses.map((exp) => (
            <li key={exp.id}>
              <strong>{exp.name}</strong> — {exp.category} — {exp.amount} € (
              {exp.date?.slice(0, 10)})
              <button onClick={() => handleDeleteExpense(exp.id)}>Obriši</button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddExpense}>
          <input
            placeholder="Naziv troška"
            value={expName}
            onChange={(e) => setExpName(e.target.value)}
            required
          />
          <select
            value={expCategory}
            onChange={(e) => setExpCategory(e.target.value)}
          >
            <option value="Prevoz">Prevoz</option>
            <option value="Smestaj">Smeštaj</option>
            <option value="Hrana">Hrana</option>
            <option value="Ulaznice">Ulaznice</option>
            <option value="Kupovina">Kupovina</option>
            <option value="Ostalo">Ostalo</option>
          </select>
          <input
            type="number"
            placeholder="Iznos"
            min="0"
            step="0.01"
            value={expAmount}
            onChange={(e) => setExpAmount(e.target.value)}
            required
          />
          <input
            type="date"
            value={expDate}
            onChange={(e) => setExpDate(e.target.value)}
            required
          />
          <input
            placeholder="Opis (opciono)"
            value={expDescription}
            onChange={(e) => setExpDescription(e.target.value)}
          />
          <button type="submit">Dodaj trošak</button>
        </form>
      </section>
    </div>
  );
}

export default TripDetailPage;