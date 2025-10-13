import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getWeek,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
  isToday,
  isFriday,
  isTuesday,
  isThursday,
  getDay,
  addWeeks,
  startOfDay,
  differenceInWeeks
} from 'date-fns';

// Re-export commonly used functions
export { isFriday, isToday, isTuesday, isThursday };

export const formatDate = (date) => format(date, 'yyyy-MM-dd');
export const formatDateDisplay = (date) => format(date, 'MMM d, yyyy');
export const formatDay = (date) => format(date, 'd');
export const formatMonth = (date) => format(date, 'MMMM yyyy');
export const formatWeekday = (date) => format(date, 'EEEE');
export const formatShortWeekday = (date) => format(date, 'EEE');

export const getMonthDays = (date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const getWeekNumber = (date) => {
  const startOfMonthDate = startOfMonth(date);
  const weekOfMonth = Math.ceil((date.getDate() + getDay(startOfMonthDate)) / 7);
  return weekOfMonth;
};

export const getSprintWeekType = (date) => {
  const weekNum = getWeekNumber(date);
  return weekNum % 2 === 1 ? 'content-theme' : 'cta-content';
};

export const getWeeksInMonth = (date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const weeks = [];

  let currentWeek = startOfWeek(start, { weekStartsOn: 1 }); // Monday start

  while (currentWeek <= end) {
    weeks.push({
      start: currentWeek < start ? start : currentWeek,
      end: endOfWeek(currentWeek, { weekStartsOn: 1 }) > end ? end : endOfWeek(currentWeek, { weekStartsOn: 1 }),
      weekNumber: weeks.length + 1,
      days: eachDayOfInterval({
        start: currentWeek < start ? start : currentWeek,
        end: endOfWeek(currentWeek, { weekStartsOn: 1 }) > end ? end : endOfWeek(currentWeek, { weekStartsOn: 1 })
      })
    });
    currentWeek = addDays(currentWeek, 7);
  }

  return weeks;
};

export const isNewsletterDay = (date, newsletterType) => {
  if (!isFriday(date)) return false;

  if (newsletterType === 'rolands-riff') {
    return true; // Every Friday
  }

  if (newsletterType === 'crazy-experiments') {
    // Bi-weekly - reference date is October 11, 2024 (a known Crazy Experiments Friday)
    const referenceDate = new Date('2024-10-11');
    const weeksDiff = differenceInWeeks(date, referenceDate);
    return weeksDiff % 2 === 0;
  }

  return false;
};

export const getDaysInWeek = (weekStart) => {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

export const getUpcomingNewsletters = (startDate, endDate) => {
  const newsletters = [];
  let current = startOfDay(startDate);

  while (current <= endDate) {
    if (isFriday(current)) {
      // Roland's Riff - every Friday
      newsletters.push({
        date: current,
        type: 'rolands-riff',
        name: "Roland's Riff"
      });

      // Crazy Experiments - bi-weekly using reference date
      if (isNewsletterDay(current, 'crazy-experiments')) {
        newsletters.push({
          date: current,
          type: 'crazy-experiments',
          name: 'Crazy Experiments'
        });
      }
    }
    current = addDays(current, 1);
  }

  return newsletters;
};

// Generate weeks around a given date for infinite scrolling
// Returns an array of week objects with all 7 days
export const generateWeeksAroundDate = (centerDate, weeksBefore = 8, weeksAfter = 8) => {
  const weeks = [];
  const startDate = addWeeks(startOfWeek(centerDate, { weekStartsOn: 0 }), -weeksBefore);
  const totalWeeks = weeksBefore + weeksAfter + 1;

  for (let i = 0; i < totalWeeks; i++) {
    const weekStart = addWeeks(startDate, i);
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    weeks.push({
      start: weekStart,
      end: weekEnd,
      weekNumber: getWeek(weekStart),
      days: days
    });
  }

  return weeks;
};