import React, { useState, useEffect, useRef, useCallback } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, getWeek, isToday as isTodayFn } from 'date-fns';
import WeekView from './WeekView';
import './CalendarView.css';

const CalendarView = () => {
  const [weeks, setWeeks] = useState([]);
  const containerRef = useRef(null);
  const isLoadingRef = useRef(false);
  const lastScrollTop = useRef(0);
  const isScrollingRef = useRef(false);

  // Generate a single week object
  const generateWeek = useCallback((weekStart) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return {
      start: weekStart,
      end: weekEnd,
      weekNumber: getWeek(weekStart),
      days: days
    };
  }, []);

  // Initialize with 5 weeks starting from current week
  useEffect(() => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });

    const initialWeeks = [];
    for (let i = 0; i <= 4; i++) {
      const weekStart = addWeeks(currentWeekStart, i);
      initialWeeks.push(generateWeek(weekStart));
    }

    setWeeks(initialWeeks);
  }, [generateWeek]);


  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoadingRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    const scrollThreshold = 200; // pixels from edge to trigger load
    const isScrollingDown = scrollTop > lastScrollTop.current;
    lastScrollTop.current = scrollTop;

    // Near top - add week before
    if (scrollTop < scrollThreshold && !isScrollingDown) {
      isLoadingRef.current = true;

      // Store the old scroll height before adding new content
      const oldScrollHeight = scrollHeight;

      setWeeks(prevWeeks => {
        const firstWeek = prevWeeks[0];
        const newWeekStart = subWeeks(firstWeek.start, 1);
        const newWeek = generateWeek(newWeekStart);

        // Add new week at beginning
        let updatedWeeks = [newWeek, ...prevWeeks];

        // Prune if more than 9 weeks (remove from end)
        if (updatedWeeks.length > 9) {
          updatedWeeks = updatedWeeks.slice(0, 9);
        }

        return updatedWeeks;
      });

      // Maintain scroll position (prevent jump)
      requestAnimationFrame(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          const scrollDiff = newScrollHeight - oldScrollHeight;
          container.scrollTop = scrollTop + scrollDiff;
        }

        // Delay resetting the loading flag to prevent rapid successive loads
        setTimeout(() => {
          isLoadingRef.current = false;
        }, 100);
      });
    }

    // Near bottom - add week after
    else if (scrollHeight - (scrollTop + clientHeight) < scrollThreshold && isScrollingDown) {
      isLoadingRef.current = true;

      setWeeks(prevWeeks => {
        const lastWeek = prevWeeks[prevWeeks.length - 1];
        const newWeekStart = addWeeks(lastWeek.start, 1);
        const newWeek = generateWeek(newWeekStart);

        // Add new week at end
        let updatedWeeks = [...prevWeeks, newWeek];

        // Prune if more than 9 weeks (remove from beginning)
        if (updatedWeeks.length > 9) {
          updatedWeeks = updatedWeeks.slice(1);
        }

        return updatedWeeks;
      });

      // Delay resetting the loading flag to prevent rapid successive loads
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 100);
    }
  }, [weeks.length, generateWeek]);

  // Handle wheel event to limit scrolling to 1 week at a time
  const handleWheel = useCallback((e) => {
    if (isScrollingRef.current) {
      e.preventDefault();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Prevent default scrolling
    e.preventDefault();

    // Get the height of one week row
    const weekElement = container.querySelector('.week-view');
    if (!weekElement) return;

    const weekHeight = weekElement.offsetHeight;

    // Determine scroll direction
    const scrollingDown = e.deltaY > 0;

    // Set scrolling flag
    isScrollingRef.current = true;

    // Scroll by exactly one week height
    const targetScroll = container.scrollTop + (scrollingDown ? weekHeight : -weekHeight);

    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });

    // Reset scrolling flag after animation completes
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 300); // Match this to your scroll animation duration
  }, []);

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleScroll, handleWheel]);

  const handleToday = () => {
    const today = new Date();
    const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });

    const newWeeks = [];
    for (let i = 0; i <= 4; i++) {
      const weekStart = addWeeks(currentWeekStart, i);
      newWeeks.push(generateWeek(weekStart));
    }

    setWeeks(newWeeks);

    // Scroll to top of container to show current week
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="calendar-view">
      <button onClick={handleToday} className="today-btn">
        Jump to Today
      </button>

      <div className="calendar-weeks" ref={containerRef}>
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
