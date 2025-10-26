import React, { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { formatDate, isTuesday, isThursday } from '../utils/dateHelpers';
import { DEFAULT_SPRINT_FOCUSES } from '../utils/sprintFocuses';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const loadingStarted = useRef(false);
  const [data, setData] = useState({
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
    sprintSchedule: {},
    weekLandingPages: {},
    weekOfferPages: {},
    ctaWeeks: {}
  });

  // Load initial data from Supabase
  useEffect(() => {
    // Prevent double execution
    if (loadingStarted.current) {
      console.log('Load already started, skipping duplicate execution');
      return;
    }
    loadingStarted.current = true;

    const loadAllData = async () => {
      console.log('DataProvider: Starting to load data from Supabase...');
      setLoading(true);

      // Check if Supabase client is available
      if (!supabase) {
        console.error('Supabase client not initialized - check environment variables');
        console.log('Using empty data state - no database connection');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading data from Supabase - queries starting...');

        // Load all data in parallel using allSettled to handle failures gracefully
        const results = await Promise.allSettled([
          supabase.from('posts').select('*'),
          supabase.from('stories').select('*'),
          supabase.from('newsletters').select('*'),
          supabase.from('tasks').select('*').order('created_at', { ascending: false }),
          supabase.from('podcast_episodes').select('*').order('created_at', { ascending: false }),
          supabase.from('podcast_clips').select('*').order('created_at', { ascending: false }),
          supabase.from('sprint_config').select('*'),
          supabase.from('sprint_focuses').select('*').eq('active', true)
        ]);

        // Extract results, handling both fulfilled and rejected promises
        const postsResult = results[0].status === 'fulfilled' ? results[0].value : { data: null, error: results[0].reason };
        const storiesResult = results[1].status === 'fulfilled' ? results[1].value : { data: null, error: results[1].reason };
        const newslettersResult = results[2].status === 'fulfilled' ? results[2].value : { data: null, error: results[2].reason };
        const tasksResult = results[3].status === 'fulfilled' ? results[3].value : { data: null, error: results[3].reason };
        const episodesResult = results[4].status === 'fulfilled' ? results[4].value : { data: null, error: results[4].reason };
        const clipsResult = results[5].status === 'fulfilled' ? results[5].value : { data: null, error: results[5].reason };
        const sprintConfigResult = results[6].status === 'fulfilled' ? results[6].value : { data: null, error: results[6].reason };
        const sprintFocusesResult = results[7].status === 'fulfilled' ? results[7].value : { data: null, error: results[7].reason };

        // Check for errors in any query
        const errors = [];
        const queryNames = ['posts', 'stories', 'newsletters', 'tasks', 'podcast_episodes', 'podcast_clips', 'sprint_config', 'sprint_focuses'];

        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            errors.push(`${queryNames[index]}: Promise rejected - ${result.reason}`);
          } else if (result.value?.error) {
            const errorMsg = result.value.error.message || result.value.error;
            errors.push(`${queryNames[index]}: ${errorMsg}`);
          }
        });

        if (errors.length > 0) {
          console.error('Errors loading from Supabase:', errors);
        } else {
          console.log('All Supabase queries completed successfully');
        }

        // Transform posts data
        const postsData = {};
        if (postsResult && postsResult.data) {
          postsResult.data.forEach(post => {
            const dateKey = formatDate(post.date);
            if (!postsData[dateKey]) postsData[dateKey] = {};
            postsData[dateKey][post.platform] = {
              done: post.done,
              link: post.link || '',
              caption: post.caption || ''
            };
          });
        }

        // Transform stories data
        if (storiesResult && storiesResult.data) {
          storiesResult.data.forEach(story => {
            const dateKey = formatDate(story.date);
            if (!postsData[dateKey]) postsData[dateKey] = {};
            postsData[dateKey].stories = {
              done: story.done,
              notes: story.notes || ''
            };
          });
        }

        // Transform newsletters data
        const newslettersData = {
          'crazy-experiments': [],
          'rolands-riff': []
        };
        if (newslettersResult && newslettersResult.data) {
          newslettersResult.data.forEach(newsletter => {
            if (newslettersData[newsletter.type]) {
              newslettersData[newsletter.type].push({
                date: formatDate(newsletter.date),
                status: newsletter.status,
                link: newsletter.link || ''
              });
            }
          });
        }

        // Transform sprint config data
        const sprintSchedule = {};
        const weekLandingPages = {};
        const weekOfferPages = {};
        const ctaWeeks = {};
        if (sprintConfigResult && sprintConfigResult.data) {
          sprintConfigResult.data.forEach(config => {
            if (config.focus_id) sprintSchedule[config.week_id] = config.focus_id;
            if (config.landing_page) weekLandingPages[config.week_id] = config.landing_page;
            if (config.offer_page) weekOfferPages[config.week_id] = config.offer_page;
            if (config.is_cta_week) ctaWeeks[config.week_id] = true;
          });
        }

        // Use custom sprint focuses if available, otherwise use defaults
        const sprintFocuses = (sprintFocusesResult && sprintFocusesResult.data && sprintFocusesResult.data.length > 0)
          ? sprintFocusesResult.data
          : DEFAULT_SPRINT_FOCUSES;

        console.log('Data loaded successfully:', {
          posts: Object.keys(postsData).length,
          newsletters: newslettersResult?.data?.length || 0,
          tasks: tasksResult?.data?.length || 0,
          episodes: episodesResult?.data?.length || 0,
          clips: clipsResult?.data?.length || 0,
          sprintConfigs: Object.keys(sprintSchedule).length,
          sprintFocuses: sprintFocuses.length
        });

        setData({
          posts: postsData,
          newsletters: newslettersData,
          tasks: tasksResult?.data || [],
          podcast: {
            episodes: episodesResult?.data || [],
            clips: clipsResult?.data || []
          },
          sprintFocuses,
          sprintSchedule,
          weekLandingPages,
          weekOfferPages,
          ctaWeeks
        });
        console.log('Data state updated, loading complete');
      } catch (error) {
        console.error('Error loading data from Supabase:', error);
        console.error('Error details:', error.message, error.stack);

        // Set default data structure even if there's an error
        setData({
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
          sprintSchedule: {},
          weekLandingPages: {},
          weekOfferPages: {},
          ctaWeeks: {}
        });
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
      }
    };

    // Call the function
    loadAllData();
  }, []);

  // Social Posts Management
  const updatePost = useCallback(async (date, platform, updates) => {
    if (!supabase) {
      console.error('Cannot update post: Supabase client not initialized');
      return;
    }

    const dateStr = formatDate(date);

    try {
      // Check if post exists
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('date', dateStr)
        .eq('platform', platform)
        .single();

      let result;
      if (existing) {
        // Update existing post
        result = await supabase
          .from('posts')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Insert new post
        result = await supabase
          .from('posts')
          .insert({
            date: dateStr,
            platform,
            ...updates
          })
          .select()
          .single();
      }

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        // Update local state
        setData(prev => ({
          ...prev,
          posts: {
            ...prev.posts,
            [dateStr]: {
              ...prev.posts[dateStr],
              [platform]: {
                ...prev.posts[dateStr]?.[platform],
                ...updates
              }
            }
          }
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const getPost = useCallback((date, platform) => {
    return data.posts[formatDate(date)]?.[platform] || {
      done: false,
      link: '',
      caption: ''
    };
  }, [data.posts]);

  const updateStories = useCallback(async (date, updates) => {
    if (!supabase) {
      console.error('Cannot update stories: Supabase client not initialized');
      return;
    }

    const dateStr = formatDate(date);

    try {
      // Check if story exists
      const { data: existing } = await supabase
        .from('stories')
        .select('id')
        .eq('date', dateStr)
        .single();

      let result;
      if (existing) {
        // Update existing story
        result = await supabase
          .from('stories')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Insert new story
        result = await supabase
          .from('stories')
          .insert({
            date: dateStr,
            ...updates
          })
          .select()
          .single();
      }

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        // Update local state
        setData(prev => ({
          ...prev,
          posts: {
            ...prev.posts,
            [dateStr]: {
              ...prev.posts[dateStr],
              stories: {
                ...prev.posts[dateStr]?.stories,
                ...updates
              }
            }
          }
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  // Newsletter Management
  const updateNewsletter = useCallback(async (type, date, updates) => {
    if (!supabase) {
      console.error('Cannot update newsletter: Supabase client not initialized');
      return;
    }

    const dateStr = formatDate(date);

    try {
      // Check if newsletter exists
      const { data: existing } = await supabase
        .from('newsletters')
        .select('id')
        .eq('date', dateStr)
        .eq('type', type)
        .single();

      let result;
      if (existing) {
        // Update existing newsletter
        result = await supabase
          .from('newsletters')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Insert new newsletter
        result = await supabase
          .from('newsletters')
          .insert({
            date: dateStr,
            type,
            ...updates
          })
          .select()
          .single();
      }

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        // Update local state
        setData(prev => {
          const newsletters = [...prev.newsletters[type]];
          const existingIndex = newsletters.findIndex(n => n.date === dateStr);

          if (existingIndex >= 0) {
            newsletters[existingIndex] = { ...newsletters[existingIndex], ...updates };
          } else {
            newsletters.push({ date: dateStr, ...updates });
          }

          return {
            ...prev,
            newsletters: {
              ...prev.newsletters,
              [type]: newsletters
            }
          };
        });
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const getNewsletter = useCallback((type, date) => {
    const newsletters = data.newsletters[type] || [];
    return newsletters.find(n => n.date === formatDate(date)) || {
      status: 'pending',
      link: ''
    };
  }, [data.newsletters]);

  // Task Management
  const addTask = useCallback(async (task) => {
    if (!supabase) {
      console.error('Cannot add task: Supabase client not initialized');
      return;
    }

    try {
      const result = await supabase
        .from('tasks')
        .insert({
          ...task,
          status: task.status || 'pending'
        })
        .select()
        .single();

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        const newTask = result.data;
        setData(prev => ({
          ...prev,
          tasks: [newTask, ...prev.tasks]
        }));
        return newTask;
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const updateTask = useCallback(async (taskId, updates) => {
    try {
      const result = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === taskId ? result.data : task
          )
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      const result = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          tasks: prev.tasks.filter(task => task.id !== taskId)
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

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
  const addPodcastEpisode = useCallback(async (episode) => {
    try {
      const result = await supabase
        .from('podcast_episodes')
        .insert({
          ...episode,
          status: episode.status || 'pending'
        })
        .select()
        .single();

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        const newEpisode = result.data;
        setData(prev => ({
          ...prev,
          podcast: {
            ...prev.podcast,
            episodes: [newEpisode, ...prev.podcast.episodes]
          }
        }));
        return newEpisode;
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const updatePodcastEpisode = useCallback(async (episodeId, updates) => {
    try {
      const result = await supabase
        .from('podcast_episodes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', episodeId)
        .select()
        .single();

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          podcast: {
            ...prev.podcast,
            episodes: prev.podcast.episodes.map(episode =>
              episode.id === episodeId ? result.data : episode
            )
          }
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const addPodcastClip = useCallback(async (clip) => {
    try {
      const result = await supabase
        .from('podcast_clips')
        .insert(clip)
        .select()
        .single();

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        const newClip = result.data;
        setData(prev => ({
          ...prev,
          podcast: {
            ...prev.podcast,
            clips: [newClip, ...prev.podcast.clips]
          }
        }));
        return newClip;
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

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
  const addSprintFocus = useCallback(async (focus) => {
    try {
      const newFocus = {
        id: focus.id || `custom-${Date.now()}`,
        name: focus.name,
        description: focus.description,
        color: focus.color,
        active: true,
        is_custom: true
      };

      const result = await supabase
        .from('sprint_focuses')
        .insert(newFocus)
        .select()
        .single();

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          sprintFocuses: [...prev.sprintFocuses, result.data]
        }));
        return result.data;
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const updateSprintFocus = useCallback(async (focusId, updates) => {
    try {
      const result = await supabase
        .from('sprint_focuses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', focusId)
        .select()
        .single();

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          sprintFocuses: prev.sprintFocuses.map(focus =>
            focus.id === focusId ? result.data : focus
          )
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const deleteSprintFocus = useCallback(async (focusId) => {
    try {
      const result = await supabase
        .from('sprint_focuses')
        .update({
          active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', focusId);

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          sprintFocuses: prev.sprintFocuses.filter(focus => focus.id !== focusId)
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const getSprintFocuses = useCallback(() => {
    return data.sprintFocuses;
  }, [data.sprintFocuses]);

  const setWeekFocus = useCallback(async (weekId, focusId) => {
    try {
      // Check if config exists
      const { data: existing } = await supabase
        .from('sprint_config')
        .select('id')
        .eq('week_id', weekId)
        .single();

      let result;
      if (existing) {
        // Update existing config
        result = await supabase
          .from('sprint_config')
          .update({
            focus_id: focusId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Insert new config
        result = await supabase
          .from('sprint_config')
          .insert({
            week_id: weekId,
            focus_id: focusId
          });
      }

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          sprintSchedule: {
            ...prev.sprintSchedule,
            [weekId]: focusId
          }
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const getWeekFocus = useCallback((weekId) => {
    return data.sprintSchedule?.[weekId] || null;
  }, [data.sprintSchedule]);

  const setWeekLandingPage = useCallback(async (weekId, url) => {
    console.log('Saving landing page:', { weekId, url });

    if (!supabase) {
      console.error('Cannot save landing page: Supabase client not initialized');
      return;
    }

    try {
      // Check if config exists
      const { data: existing } = await supabase
        .from('sprint_config')
        .select('id')
        .eq('week_id', weekId)
        .single();

      let result;
      if (existing) {
        // Update existing config
        result = await supabase
          .from('sprint_config')
          .update({
            landing_page: url,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        // Insert new config
        result = await supabase
          .from('sprint_config')
          .insert({
            week_id: weekId,
            landing_page: url
          })
          .select()
          .single();
      }

      console.log('Supabase save result:', result);

      if (result && result.error) {
        console.error('Failed to save landing page:', result.error);
        handleSupabaseError(result.error);
      } else {
        console.log('Landing page saved successfully to Supabase');
        setData(prev => ({
          ...prev,
          weekLandingPages: {
            ...prev.weekLandingPages,
            [weekId]: url
          }
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const getWeekLandingPage = useCallback((weekId) => {
    return data.weekLandingPages?.[weekId] || '';
  }, [data.weekLandingPages]);

  const setWeekOfferPage = useCallback(async (weekId, url) => {
    try {
      // Check if config exists
      const { data: existing } = await supabase
        .from('sprint_config')
        .select('id')
        .eq('week_id', weekId)
        .single();

      let result;
      if (existing) {
        // Update existing config
        result = await supabase
          .from('sprint_config')
          .update({
            offer_page: url,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Insert new config
        result = await supabase
          .from('sprint_config')
          .insert({
            week_id: weekId,
            offer_page: url
          });
      }

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          weekOfferPages: {
            ...prev.weekOfferPages,
            [weekId]: url
          }
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const getWeekOfferPage = useCallback((weekId) => {
    return data.weekOfferPages?.[weekId] || '';
  }, [data.weekOfferPages]);

  const setWeekAsCTA = useCallback(async (weekId, isCTA) => {
    try {
      // Check if config exists
      const { data: existing } = await supabase
        .from('sprint_config')
        .select('id')
        .eq('week_id', weekId)
        .single();

      let result;
      if (existing) {
        // Update existing config
        result = await supabase
          .from('sprint_config')
          .update({
            is_cta_week: isCTA,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Insert new config
        result = await supabase
          .from('sprint_config')
          .insert({
            week_id: weekId,
            is_cta_week: isCTA
          });
      }

      if (result.error) {
        handleSupabaseError(result.error);
      } else {
        setData(prev => ({
          ...prev,
          ctaWeeks: {
            ...prev.ctaWeeks,
            [weekId]: isCTA
          }
        }));
      }
    } catch (error) {
      handleSupabaseError(error);
    }
  }, []);

  const isWeekCTA = useCallback((weekId) => {
    return data.ctaWeeks?.[weekId] || false;
  }, [data.ctaWeeks]);

  const value = {
    data,
    loading,
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
      {loading ? (
        <LoadingSpinner message="Loading your content data..." />
      ) : (
        children
      )}
    </DataContext.Provider>
  );
};