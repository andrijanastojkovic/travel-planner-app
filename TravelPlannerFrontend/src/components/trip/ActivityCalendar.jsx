import { useState } from 'react';

function ActivityCalendar({ activities, onSelectActivity }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const activitiesByDate = {};
  activities.forEach((a) => {
    const dateKey = a.date?.slice(0, 10);
    if (!dateKey) return;
    if (!activitiesByDate[dateKey]) activitiesByDate[dateKey] = [];
    activitiesByDate[dateKey].push(a);
  });

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startWeekday = (firstDayOfMonth.getDay() + 6) % 7; // ponedeljak = 0

  const days = [];
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const monthNames = [
    'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
    'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
  ];

  const weekdayNames = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button type="button" className="btn-small" onClick={goPrevMonth}>←</button>
        <strong>{monthNames[viewMonth]} {viewYear}</strong>
        <button type="button" className="btn-small" onClick={goNextMonth}>→</button>
      </div>

      <div className="calendar-grid calendar-weekdays">
        {weekdayNames.map((wd) => (
          <div key={wd} className="calendar-weekday">{wd}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-cell calendar-cell-empty" />;
          }
          const dateKey = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
          const dayActivities = activitiesByDate[dateKey] || [];

          return (
            <div key={dateKey} className="calendar-cell">
              <div className="calendar-day-number">{day}</div>
              {dayActivities.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="calendar-activity"
                  onClick={() => onSelectActivity(a)}
                  title={a.name}
                >
                  {a.name}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ActivityCalendar;