import { useState, useEffect } from 'react';
import * as expenseService from '../../services/expenseService';

function ExpensesSection({ tripId, budget, onError, onSuccess }) {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalSpent: 0, expenseCount: 0 });

  const [expName, setExpName] = useState('');
  const [expCategory, setExpCategory] = useState('Ostalo');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('');
  const [expDescription, setExpDescription] = useState('');

  const loadExpenses = async () => {
    const expData = await expenseService.getExpenses(tripId);
    const summaryData = await expenseService.getExpenseSummary(tripId);
    setExpenses(expData);
    setSummary(summaryData);
  };

  useEffect(() => {
    loadExpenses();
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    onError('');
    try {
      await expenseService.createExpense(tripId, {
        tripPlanId: tripId,
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
      onSuccess('Trošak uspešno dodat.');
      loadExpenses();
    } catch (err) {
      onError(err.response?.data?.message || 'Greška pri dodavanju troška.');
    }
  };

  const handleDelete = async (expId) => {
    onError('');
    try {
      await expenseService.deleteExpense(tripId, expId);
      onSuccess('Trošak uspešno obrisan.');
      loadExpenses();
    } catch (err) {
      onError('Greška pri brisanju troška.');
    }
  };

  return (
    <section>
      <h2>Troškovi</h2>
      <p>
        Ukupno potrošeno: <strong>{summary.totalSpent} €</strong>
        {' '}(planirani budžet: {budget} €, preostalo: {(budget - summary.totalSpent).toFixed(2)} €)
      </p>

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            <strong>{exp.name}</strong> — {exp.category} — {exp.amount} € (
            {exp.date?.slice(0, 10)})
            <button className="btn-small btn-danger" onClick={() => handleDelete(exp.id)}>Obriši</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd}>
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
        <button type="submit" className="btn-primary">Dodaj trošak</button>
      </form>
    </section>
  );
}

export default ExpensesSection;