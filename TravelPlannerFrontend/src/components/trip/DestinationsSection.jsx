import { useState, useEffect } from 'react';
import * as destinationService from '../../services/destinationService';

function DestinationsSection({ tripId, onError, onSuccess }) {
  const [destinations, setDestinations] = useState([]);
  const [editingDestId, setEditingDestId] = useState(null);

  const [destName, setDestName] = useState('');
  const [destLocation, setDestLocation] = useState('');
  const [destArrival, setDestArrival] = useState('');
  const [destDeparture, setDestDeparture] = useState('');

  const loadDestinations = async () => {
    const data = await destinationService.getDestinations(tripId);
    setDestinations(data);
  };

  useEffect(() => {
    loadDestinations();
  }, [tripId]);

  const startEdit = (dest) => {
    setEditingDestId(dest.id);
    setDestName(dest.name);
    setDestLocation(dest.location);
    setDestArrival(dest.arrivalDate?.slice(0, 10));
    setDestDeparture(dest.departureDate?.slice(0, 10));
  };

  const cancelEdit = () => {
    setEditingDestId(null);
    setDestName('');
    setDestLocation('');
    setDestArrival('');
    setDestDeparture('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    onError('');
    try {
      const payload = {
        name: destName,
        location: destLocation,
        arrivalDate: destArrival,
        departureDate: destDeparture,
      };

      if (editingDestId) {
        await destinationService.updateDestination(tripId, editingDestId, payload);
      } else {
        await destinationService.createDestination(tripId, payload);
      }

      onSuccess(editingDestId ? 'Destinacija uspešno izmenjena.' : 'Destinacija uspešno dodata.');
      cancelEdit();
      loadDestinations();
    } catch (err) {
      onError(err.response?.data?.message || 'Greška pri čuvanju destinacije.');
    }
  };

  const handleDelete = async (destId) => {
    onError('');
    try {
      await destinationService.deleteDestination(tripId, destId);
      setDestinations(destinations.filter((d) => d.id !== destId));
      onSuccess('Destinacija uspešno obrisana.');
    } catch (err) {
      onError('Greška pri brisanju destinacije.');
    }
  };

  return (
    <section>
      <h2>Destinacije</h2>
      <ul>
        {destinations.map((d) => (
          <li key={d.id}>
            <strong>{d.name}</strong> — {d.location} (
            {d.arrivalDate?.slice(0, 10)} — {d.departureDate?.slice(0, 10)})
            <div>
              <button className="btn-small" onClick={() => startEdit(d)}>Izmeni</button>
              <button className="btn-small btn-danger" onClick={() => handleDelete(d.id)}>Obriši</button>
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSave}>
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
          <button type="button" onClick={cancelEdit}>Otkaži</button>
        )}
      </form>
    </section>
  );
}

export default DestinationsSection;