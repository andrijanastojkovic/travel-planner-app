import { useState, useEffect } from 'react';
import * as checklistService from '../../services/checklistService';

function ChecklistSection({ tripId, onError, onSuccess }) {
  const [checklistItems, setChecklistItems] = useState([]);
  const [checklistName, setChecklistName] = useState('');

  const loadChecklistItems = async () => {
    const data = await checklistService.getChecklistItems(tripId);
    setChecklistItems(data);
  };

  useEffect(() => {
    loadChecklistItems();
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    onError('');
    try {
      await checklistService.createChecklistItem(tripId, { name: checklistName });
      setChecklistName('');
      onSuccess('Stavka uspešno dodata.');
      loadChecklistItems();
    } catch (err) {
      onError('Greška pri dodavanju stavke.');
    }
  };

  const handleToggle = async (itemId) => {
    onError('');
    try {
      const updated = await checklistService.toggleChecklistItem(tripId, itemId);
      setChecklistItems(
        checklistItems.map((item) => (item.id === itemId ? updated : item))
      );
    } catch (err) {
      onError('Greška pri izmeni stavke.');
    }
  };

  const handleDelete = async (itemId) => {
    onError('');
    try {
      await checklistService.deleteChecklistItem(tripId, itemId);
      setChecklistItems(checklistItems.filter((item) => item.id !== itemId));
      onSuccess('Stavka uspešno obrisana.');
    } catch (err) {
      onError('Greška pri brisanju stavke.');
    }
  };

  return (
    <section>
      <h2>Checklist</h2>
      <ul>
        {checklistItems.map((item) => (
          <li key={item.id} className="checklist-item">
            <input
              type="checkbox"
              className="checklist-checkbox"
              checked={item.isDone}
              onChange={() => handleToggle(item.id)}
            />
            <span
              style={{
                textDecoration: item.isDone ? 'line-through' : 'none',
              }}
            >
              {item.name}
            </span>
            <button className="btn-small btn-danger" onClick={() => handleDelete(item.id)}>Obriši</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd}>
        <input
          placeholder="Nova stavka"
          value={checklistName}
          onChange={(e) => setChecklistName(e.target.value)}
          required
        />
        <button type="submit">Dodaj stavku</button>
      </form>
    </section>
  );
}

export default ChecklistSection;