function TripHeader({ trip }) {
  return (
    <>
      <h1>{trip.name}</h1>
      <p>{trip.description}</p>
      <p>
        {trip.startDate?.slice(0, 10)} — {trip.endDate?.slice(0, 10)}
      </p>
      <p>Budžet: {trip.budget} €</p>
      <p>Napomene: {trip.notes}</p>
    </>
  );
}

export default TripHeader;