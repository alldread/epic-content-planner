import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import DayCard from './DayCard';
import SprintFocusSelector from '../SprintFocus/SprintFocusSelector';
import { useData } from '../../contexts/SupabaseDataContext';
import './WeekView.css';

const WeekView = forwardRef(({ week, weekNumber, currentDate }, ref) => {
  const { getWeekFocus, getSprintFocuses, isWeekCTA } = useData();

  // Create a unique week ID based on year and week number
  const weekId = `${format(currentDate, 'yyyy')}-W${weekNumber}`;
  const currentFocusId = getWeekFocus(weekId);
  const focuses = getSprintFocuses();
  const currentFocus = focuses.find(f => f.id === currentFocusId);
  const isCtaWeek = isWeekCTA(weekId);

  // Determine sprint type
  const defaultSprintType = isCtaWeek ? 'cta-content' : 'content-theme';
  const sprintType = currentFocus ? 'custom-focus' : defaultSprintType;

  return (
    <div
      ref={ref}
      className={`week-view ${sprintType}`}
      style={{
        borderLeftColor: currentFocus?.color || 'transparent'
      }}
    >
      <div className="week-header">
        <div className="week-info">
          <h3>Week {weekNumber}</h3>
          <SprintFocusSelector weekId={weekId} weekNumber={weekNumber} />
        </div>
      </div>
      <div className="week-days">
        {week.days.map((day, index) => (
          <DayCard key={`day-${index}`} date={day} />
        ))}
      </div>
    </div>
  );
});

WeekView.displayName = 'WeekView';

export default WeekView;
