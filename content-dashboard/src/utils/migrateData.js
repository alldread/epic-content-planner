import { supabase } from '../lib/supabase';

export const migrateLocalStorageToSupabase = async () => {
  try {
    // Get existing localStorage data
    const localData = localStorage.getItem('content-dashboard');
    if (!localData) {
      console.log('No localStorage data to migrate');
      return { success: true, message: 'No data to migrate' };
    }

    const data = JSON.parse(localData);
    console.log('Starting migration of localStorage data to Supabase...');

    const errors = [];
    let migratedCount = 0;

    // Migrate posts
    if (data.posts) {
      for (const [date, platforms] of Object.entries(data.posts)) {
        for (const [platform, postData] of Object.entries(platforms)) {
          if (platform === 'stories') {
            // Handle stories separately
            try {
              await supabase
                .from('stories')
                .upsert({
                  date,
                  done: postData.done || false,
                  notes: postData.notes || ''
                }, { onConflict: 'date' });
              migratedCount++;
            } catch (err) {
              errors.push(`Story ${date}: ${err.message}`);
            }
          } else {
            // Handle regular posts
            try {
              await supabase
                .from('posts')
                .upsert({
                  date,
                  platform,
                  done: postData.done || false,
                  link: postData.link || '',
                  caption: postData.caption || ''
                }, { onConflict: 'date,platform' });
              migratedCount++;
            } catch (err) {
              errors.push(`Post ${date}/${platform}: ${err.message}`);
            }
          }
        }
      }
    }

    // Migrate newsletters
    if (data.newsletters) {
      for (const [type, newsletters] of Object.entries(data.newsletters)) {
        for (const newsletter of newsletters) {
          try {
            await supabase
              .from('newsletters')
              .upsert({
                date: newsletter.date,
                type,
                status: newsletter.status || 'pending',
                link: newsletter.link || ''
              }, { onConflict: 'date,type' });
            migratedCount++;
          } catch (err) {
            errors.push(`Newsletter ${type}/${newsletter.date}: ${err.message}`);
          }
        }
      }
    }

    // Migrate tasks
    if (data.tasks && data.tasks.length > 0) {
      for (const task of data.tasks) {
        try {
          // Don't include the id from localStorage, let Supabase generate new ones
          const { id, createdAt, ...taskData } = task;
          await supabase
            .from('tasks')
            .insert({
              ...taskData,
              created_at: createdAt || new Date().toISOString()
            });
          migratedCount++;
        } catch (err) {
          errors.push(`Task "${task.title}": ${err.message}`);
        }
      }
    }

    // Migrate podcast episodes
    if (data.podcast?.episodes && data.podcast.episodes.length > 0) {
      for (const episode of data.podcast.episodes) {
        try {
          const { id, createdAt, ...episodeData } = episode;
          await supabase
            .from('podcast_episodes')
            .insert({
              ...episodeData,
              created_at: createdAt || new Date().toISOString()
            });
          migratedCount++;
        } catch (err) {
          errors.push(`Episode "${episode.title}": ${err.message}`);
        }
      }
    }

    // Migrate podcast clips
    if (data.podcast?.clips && data.podcast.clips.length > 0) {
      for (const clip of data.podcast.clips) {
        try {
          const { id, createdAt, ...clipData } = clip;
          await supabase
            .from('podcast_clips')
            .insert({
              ...clipData,
              created_at: createdAt || new Date().toISOString()
            });
          migratedCount++;
        } catch (err) {
          errors.push(`Clip "${clip.title}": ${err.message}`);
        }
      }
    }

    // Migrate sprint configuration
    if (data.sprintSchedule || data.weekLandingPages || data.weekOfferPages || data.ctaWeeks) {
      const weekIds = new Set([
        ...Object.keys(data.sprintSchedule || {}),
        ...Object.keys(data.weekLandingPages || {}),
        ...Object.keys(data.weekOfferPages || {}),
        ...Object.keys(data.ctaWeeks || {})
      ]);

      for (const weekId of weekIds) {
        try {
          await supabase
            .from('sprint_config')
            .upsert({
              week_id: weekId,
              focus_id: data.sprintSchedule?.[weekId] || null,
              landing_page: data.weekLandingPages?.[weekId] || null,
              offer_page: data.weekOfferPages?.[weekId] || null,
              is_cta_week: data.ctaWeeks?.[weekId] || false
            }, { onConflict: 'week_id' });
          migratedCount++;
        } catch (err) {
          errors.push(`Sprint config ${weekId}: ${err.message}`);
        }
      }
    }

    // Migrate custom sprint focuses
    if (data.sprintFocuses) {
      for (const focus of data.sprintFocuses) {
        // Only migrate custom focuses (default ones are already in the database)
        if (focus.id && focus.id.startsWith('custom-')) {
          try {
            await supabase
              .from('sprint_focuses')
              .upsert({
                id: focus.id,
                name: focus.name,
                description: focus.description,
                color: focus.color,
                active: focus.active !== false,
                is_custom: true
              }, { onConflict: 'id' });
            migratedCount++;
          } catch (err) {
            errors.push(`Sprint focus "${focus.name}": ${err.message}`);
          }
        }
      }
    }

    console.log(`Migration complete! Migrated ${migratedCount} items.`);
    if (errors.length > 0) {
      console.warn('Migration completed with errors:', errors);
    }

    return {
      success: true,
      message: `Successfully migrated ${migratedCount} items`,
      errors: errors.length > 0 ? errors : null
    };
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      message: 'Migration failed',
      error: error.message
    };
  }
};

// Function to backup localStorage data before migration
export const backupLocalStorageData = () => {
  const data = localStorage.getItem('content-dashboard');
  if (data) {
    const backup = {
      data: JSON.parse(data),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('content-dashboard-backup', JSON.stringify(backup));
    return backup;
  }
  return null;
};