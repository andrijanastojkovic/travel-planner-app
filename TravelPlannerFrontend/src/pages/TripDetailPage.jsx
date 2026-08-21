import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as tripPlanService from '../services/tripPlanService';
import TripHeader from '../components/trip/TripHeader';
import ShareSection from '../components/trip/ShareSection';
import DestinationsSection from '../components/trip/DestinationsSection';
import ActivitiesSection from '../components/trip/ActivitiesSection';
import ChecklistSection from '../components/trip/ChecklistSection';
import ExpensesSection from '../components/trip/ExpensesSection';

function TripDetailPage() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadTrip = async () => {
    setLoading(true);
    try {
      const tripData = await tripPlanService.getTripPlan(id);
      setTrip(tripData);
    } catch (err) {
      setLoadError('Neuspešno učitavanje plana.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) return <p>Učitavanje...</p>;
  if (loadError) return <p className="error-text">{loadError}</p>;
  if (!trip) return null;

  return (
    <div className="page">
      <div className="container">
        <Link to="/trips" className="back-link">← Nazad na listu</Link>

        <TripHeader trip={trip} />

        {actionError && <p className="error-text">{actionError}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}

        <ShareSection tripId={id} />

        <DestinationsSection
          tripId={id}
          onError={setActionError}
          onSuccess={showSuccess}
        />

        <ActivitiesSection
          tripId={id}
          onError={setActionError}
          onSuccess={showSuccess}
        />

        <ChecklistSection
          tripId={id}
          onError={setActionError}
          onSuccess={showSuccess}
        />

        <ExpensesSection
          tripId={id}
          budget={trip.budget}
          onError={setActionError}
          onSuccess={showSuccess}
        />
      </div>
    </div>
  );
}

export default TripDetailPage;