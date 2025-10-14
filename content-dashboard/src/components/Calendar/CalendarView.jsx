import React, { useState, useEffect, useCallback } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, getWeek } from 'date-fns';
import WeekView from './WeekView';
import './CalendarView.css';

const VISIBLE_WEEKS = 5;

const CalendarView = () => {
  const [startWeek, setStartWeek] = useState(null);
  const [weeks, setWeeks] = useState([]);

  const generateWeek = useCallback((weekStart) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return {
      start: weekStart,
      end: weekEnd,
      weekNumber: getWeek(weekStart),
      days
    };
  }, []);

  const buildWeeks = useCallback((weekStart) => {
    const list = [];
    for (let i = 0; i < VISIBLE_WEEKS; i += 1) {
      const currentWeekStart = addWeeks(weekStart, i);
      list.push(generateWeek(currentWeekStart));
    }
    return list;
  }, [generateWeek]);

  useEffect(() => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
    setStartWeek(currentWeekStart);
  }, []);

  useEffect(() => {
    if (!startWeek) return;
    setWeeks(buildWeeks(startWeek));
  }, [startWeek, buildWeeks]);

  const handleToday = useCallback(() => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
    setStartWeek(currentWeekStart);
  }, [setStartWeek]);

  const handlePreviousWeeks = useCallback(() => {
    setStartWeek(prev => {
      const base = prev ?? startOfWeek(new Date(), { weekStartsOn: 0 });
      return subWeeks(base, 1);
    });
  }, [setStartWeek]);

  const handleNextWeeks = useCallback(() => {
    setStartWeek(prev => {
      const base = prev ?? startOfWeek(new Date(), { weekStartsOn: 0 });
      return addWeeks(base, 1);
    });
  }, [setStartWeek]);

  return (
    <div className="calendar-view">
      <div className="calendar-controls">
        <button
          type="button"
          onClick={handlePreviousWeeks}
          className="week-nav-btn"
          aria-label="Show previous week"
        >
          ↑
        </button>
        <button type="button" onClick={handleToday} className="today-btn">
          Jump to Today
        </button>
        <button
          type="button"
          onClick={handleNextWeeks}
          className="week-nav-btn"
          aria-label="Show next week"
        >
          ↓
        </button>
      </div>

      <div className="calendar-weeks">
        {weeks.map((week) => (
          <WeekView
            key={`week-${format(week.start, 'yyyy-MM-dd')}`}
            week={week}
            weekNumber={week.weekNumber}
            currentDate={week.start}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
