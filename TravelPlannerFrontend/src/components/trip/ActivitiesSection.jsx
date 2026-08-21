import { useState, useEffect } from 'react';
import * as activityService from '../../services/activityService';
import ActivityCalendar from './ActivityCalendar';

function ActivitiesSection({ tripId, onError, onSuccess }) {
  const [activities, setActivities] = useState([]);
  const [editingActId, setEditingActId] = useState(null);
  const [view, setView] = useState('list');

  const [actName, setActName] = useState('');
  const [actDate, setActDate] = useState('');
  const [actTime, setActTime] = useState('');
  const [actLocation, setActLocation] = useState('');
  const [actCost, setActCost] = useState('');
  const [actStatus, setActStatus] = useState('Planirano');

  const loadActivities = async () => {
    const data = await activityService.getActivities(tripId);
    setActivities(data);
  };

  useEffect(() => {
    loadActivities();
  }, [tripId]);

  const startEdit = (act) => {
    setEditingActId(act.id);
    setActName(act.name);
    setActDate(act.date?.slice(0, 10));
    setActTime(act.time ? act.time.slice(0, 5) : '');
    setActLocation(act.location || '');
    setActCost(act.estimatedCost);
    setActStatus(act.status);
  };

  const cancelEdit = () => {
    setEditingActId(null);
    setActName('');
    setActDate('');
    setActTime('');
    setActLocation('');
    setActCost('');
    setActStatus('Planirano');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    onError('');
    try {
      const payload = {
        name: actName,
        date: actDate,
        time: actTime ? `${actTime}:00` : null,
        location: actLocation,
        estimatedCost: parseFloat(actCost) || 0,
        status: actStatus,
      };

      if (editingActId) {
        await activityService.updateActivity(tripId, editingActId, payload);
      } else {
        await activityService.createActivity(tripId, payload);
      }

      onSuccess(editingActId ? 'Aktivnost uspešno izmenjena.' : 'Aktivnost uspešno dodata.');
      cancelEdit();
      loadActivities();
    } catch (err) {
      onError(err.response?.data?.message || 'Greška pri čuvanju aktivnosti.');
    }
  };

  const handleDelete = async (actId) => {
    onError('');
    try {
      await activityService.deleteActivity(tripId, actId);
      setActivities(activities.filter((a) => a.id !== actId));
      onSuccess('Aktivnost uspešno obrisana.');
    } catch (err) {
      onError('Greška pri brisanju aktivnosti.');
    }
  };

  const groupedByDate = {};
  activities.forEach((a) => {
    const dateKey = a.date?.slice(0, 10) || 'Nepoznat datum';
    if (!groupedByDate[dateKey]) groupedByDate[dateKey] = [];
    groupedByDate[dateKey].push(a);
  });
  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <section>
      <h2>Aktivnosti</h2>

      <div className="view-toggle">
        <button
          type="button"
          className={view === 'list' ? 'btn-primary btn-small' : 'btn-small'}
          onClick={() => setView('list')}
        >
          Lista
        </button>
        <button
          type="button"
          className={view === 'calendar' ? 'btn-primary btn-small' : 'btn-small'}
          onClick={() => setView('calendar')}
        >
          Kalendar
        </button>
      </div>

      {view === 'list' ? (
        sortedDates.length === 0 ? (
          <p>Nema unetih aktivnosti.</p>
        ) : (
          sortedDates.map((dateKey) => (
            <div key={dateKey} className="activity-date-group">
              <div className="activity-date-heading">{dateKey}</div>
              <ul>
                {groupedByDate[dateKey].map((a) => (
                  <li key={a.id}>
                    <strong>{a.name}</strong>{' '}
                    {a.time ? `u ${a.time}` : ''} ({a.status}) — {a.estimatedCost} €
                    <div>
                      <button className="btn-small" onClick={() => startEdit(a)}>Izmeni</button>
                      <button className="btn-small btn-danger" onClick={() => handleDelete(a.id)}>Obriši</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )
      ) : (
        <ActivityCalendar activities={activities} onSelectActivity={startEdit} />
      )}

      <form onSubmit={handleSave}>
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
        <select value={actStatus} onChange={(e) => setActStatus(e.target.value)}>
          <option value="Planirano">Planirano</option>
          <option value="Rezervisano">Rezervisano</option>
          <option value="Zavrseno">Završeno</option>
          <option value="Otkazano">Otkazano</option>
        </select>
        <button type="submit" className="btn-primary">
          {editingActId ? 'Sačuvaj izmene' : 'Dodaj aktivnost'}
        </button>
        {editingActId && (
          <button type="button" onClick={cancelEdit}>Otkaži</button>
        )}
      </form>
    </section>
  );
}

export default ActivitiesSection;