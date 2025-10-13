import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatDate, isTuesday, isThursday } from '../utils/dateHelpers';
import { DEFAULT_SPRINT_FOCUSES } from '../utils/sprintFocuses';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const initialData = {
  posts: {},
  newsletters: {
    'crazy-experiments': [],
    'rolands-riff': []
  },
  tasks: [],
  podcast: {
    episodes: [],
    clips: []
  },
  sprintFocuses: DEFAULT_SPRINT_FOCUSES,
  sprintSchedule: {}, // Format: { '2024-W1': 'epic-network', '2024-W2': 'epic-deal-fastrack' }
  weekLandingPages: {}, // Format: { '2024-W2': 'https://example.com/offer' }
  weekOfferPages: {}, // Format: { '2024-W2': 'https://example.com/checkout' }
  ctaWeeks: {} // Format: { '2024-W2': true } - tracks which weeks are marked as CTA weeks
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useLocalStorage('content-dashboard', initialData);

  // Social Posts Management
  const updatePost = useCallback((date, platform, updates) => {
    setData(prev => ({
      ...prev,
      posts: {
        ...prev.posts,
        [formatDate(date)]: {
          ...prev.posts[formatDate(date)],
          [platform]: {
            ...prev.posts[formatDate(date)]?.[platform],
            ...updates
          }
        }
      }
    }));
  }, [setData]);

  const getPost = useCallback((date, platform) => {
    return data.posts[formatDate(date)]?.[platform] || {
      done: false,
      link: '',
      caption: ''
    };
  }, [data.posts]);

  const updateStories = useCallback((date, updates) => {
    setData(prev => ({
      ...prev,
      posts: {
        ...prev.posts,
        [formatDate(date)]: {
          ...prev.posts[formatDate(date)],
          stories: {
            ...prev.posts[formatDate(date)]?.stories,
            ...updates
          }
        }
      }
    }));
  }, [setData]);

  // Newsletter Management
  const updateNewsletter = useCallback((type, date, updates) => {
    setData(prev => {
      const newsletters = prev.newsletters[type] || [];
      const existingIndex = newsletters.findIndex(n => n.date === formatDate(date));

      if (existingIndex >= 0) {
        newsletters[existingIndex] = { ...newsletters[existingIndex], ...updates };
      } else {
        newsletters.push({ date: formatDate(date), ...updates });
      }

      return {
        ...prev,
        newsletters: {
          ...prev.newsletters,
          [type]: newsletters
        }
      };
    });
  }, [setData]);

  const getNewsletter = useCallback((type, date) => {
    const newsletters = data.newsletters[type] || [];
    return newsletters.find(n => n.date === formatDate(date)) || {
      status: 'pending',
      link: ''
    };
  }, [data.newsletters]);

  // Task Management
  const addTask = useCallback((task) => {
    const newTask = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...task
    };
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    return newTask;
  }, [setData]);

  const updateTask = useCallback((taskId, updates) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  }, [setData]);

  const deleteTask = useCallback((taskId) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  }, [setData]);

  const getTasks = useCallback((date = null, tag = null) => {
    let tasks = data.tasks;

    if (date) {
      tasks = tasks.filter(task => task.date === formatDate(date));
    }

    if (tag) {
      tasks = tasks.filter(task => task.tag === tag);
    }

    return tasks;
  }, [data.tasks]);

  // Podcast Management
  const addPodcastEpisode = useCallback((episode) => {
    const newEpisode = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...episode
    };
    setData(prev => ({
      ...prev,
      podcast: {
        ...prev.podcast,
        episodes: [...prev.podcast.episodes, newEpisode]
      }
    }));
    return newEpisode;
  }, [setData]);

  const updatePodcastEpisode = useCallback((episodeId, updates) => {
    setData(prev => ({
      ...prev,
      podcast: {
        ...prev.podcast,
        episodes: prev.podcast.episodes.map(episode =>
          episode.id === episodeId ? { ...episode, ...updates } : episode
        )
      }
    }));
  }, [setData]);

  const addPodcastClip = useCallback((clip) => {
    const newClip = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...clip
    };
    setData(prev => ({
      ...prev,
      podcast: {
        ...prev.podcast,
        clips: [...prev.podcast.clips, newClip]
      }
    }));
    return newClip;
  }, [setData]);

  // Get daily completion status
  const getDayCompletion = useCallback((date) => {
    const dateStr = formatDate(date);
    const dayData = data.posts[dateStr] || {};

    // Base platforms that are required every day
    const platforms = ['instagram', 'linkedin', 'youtube'];

    // Add Business Lunch Instagram on Tuesdays and Thursdays
    if (isTuesday(date) || isThursday(date)) {
      platforms.push('instagram-business-lunch');
    }

    const platformsComplete = platforms.every(p => dayData[p]?.done);
    const storiesComplete = dayData.stories?.done || false;

    return {
      platforms: platforms.map(p => ({
        name: p,
        done: dayData[p]?.done || false
      })),
      stories: storiesComplete,
      allComplete: platformsComplete && storiesComplete
    };
  }, [data.posts]);

  // Sprint Focus Management
  const addSprintFocus = useCallback((focus) => {
    const newFocus = {
      id: focus.id || `custom-${Date.now()}`,
      active: true,
      ...focus
    };
    setData(prev => ({
      ...prev,
      sprintFocuses: [...prev.sprintFocuses, newFocus]
    }));
    return newFocus;
  }, [setData]);

  const updateSprintFocus = useCallback((focusId, updates) => {
    setData(prev => ({
      ...prev,
      sprintFocuses: prev.sprintFocuses.map(focus =>
        focus.id === focusId ? { ...focus, ...updates } : focus
      )
    }));
  }, [setData]);

  const deleteSprintFocus = useCallback((focusId) => {
    setData(prev => ({
      ...prev,
      sprintFocuses: prev.sprintFocuses.filter(focus => focus.id !== focusId)
    }));
  }, [setData]);

  const getSprintFocuses = useCallback(() => {
    return data.sprintFocuses || DEFAULT_SPRINT_FOCUSES;
  }, [data.sprintFocuses]);

  const setWeekFocus = useCallback((weekId, focusId) => {
    setData(prev => ({
      ...prev,
      sprintSchedule: {
        ...prev.sprintSchedule,
        [weekId]: focusId
      }
    }));
  }, [setData]);

  const getWeekFocus = useCallback((weekId) => {
    return data.sprintSchedule?.[weekId] || null;
  }, [data.sprintSchedule]);

  const setWeekLandingPage = useCallback((weekId, url) => {
    setData(prev => ({
      ...prev,
      weekLandingPages: {
        ...prev.weekLandingPages,
        [weekId]: url
      }
    }));
  }, [setData]);

  const getWeekLandingPage = useCallback((weekId) => {
    return data.weekLandingPages?.[weekId] || '';
  }, [data.weekLandingPages]);

  const setWeekOfferPage = useCallback((weekId, url) => {
    setData(prev => ({
      ...prev,
      weekOfferPages: {
        ...prev.weekOfferPages,
        [weekId]: url
      }
    }));
  }, [setData]);

  const getWeekOfferPage = useCallback((weekId) => {
    return data.weekOfferPages?.[weekId] || '';
  }, [data.weekOfferPages]);

  const setWeekAsCTA = useCallback((weekId, isCTA) => {
    setData(prev => ({
      ...prev,
      ctaWeeks: {
        ...prev.ctaWeeks,
        [weekId]: isCTA
      }
    }));
  }, [setData]);

  const isWeekCTA = useCallback((weekId) => {
    return data.ctaWeeks?.[weekId] || false;
  }, [data.ctaWeeks]);

  const value = {
    data,
    // Social Posts
    updatePost,
    getPost,
    updateStories,
    getDayCompletion,
    // Newsletters
    updateNewsletter,
    getNewsletter,
    // Tasks
    addTask,
    updateTask,
    deleteTask,
    getTasks,
    // Podcast
    addPodcastEpisode,
    updatePodcastEpisode,
    addPodcastClip,
    // Sprint Focuses
    addSprintFocus,
    updateSprintFocus,
    deleteSprintFocus,
    getSprintFocuses,
    setWeekFocus,
    getWeekFocus,
    setWeekLandingPage,
    getWeekLandingPage,
    setWeekOfferPage,
    getWeekOfferPage,
    setWeekAsCTA,
    isWeekCTA
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};