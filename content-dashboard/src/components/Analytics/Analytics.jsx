import React from 'react';
import { useData } from '../../contexts/SupabaseDataContext';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import './Analytics.css';

const Analytics = () => {
  const { data } = useData();
  const currentMonth = new Date();
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Calculate statistics
  const calculateStats = () => {
    let totalPosts = 0;
    let completedPosts = 0;
    let platformStats = {
      instagram: { total: 0, completed: 0 },
      linkedin: { total: 0, completed: 0 },
      youtube: { total: 0, completed: 0 },
      stories: { total: 0, completed: 0 }
    };

    monthDays.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayData = data.posts[dateKey] || {};

      ['instagram', 'linkedin', 'youtube'].forEach(platform => {
        platformStats[platform].total++;
        if (dayData[platform]?.done) {
          platformStats[platform].completed++;
          completedPosts++;
        }
        totalPosts++;
      });

      platformStats.stories.total++;
      if (dayData.stories?.done) {
        platformStats.stories.completed++;
        completedPosts++;
      }
      totalPosts++;
    });

    const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = data.tasks.length;

    return {
      totalPosts,
      completedPosts,
      platformStats,
      completedTasks,
      totalTasks,
      completionRate: totalPosts ? Math.round((completedPosts / totalPosts) * 100) : 0,
      taskCompletionRate: totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const stats = calculateStats();

  return (
    <div className="analytics-view">
      <h2>Analytics Dashboard</h2>

      <div className="stats-overview">
        <div className="stat-card card shadow-m">
          <h3>Overall Completion</h3>
          <div className="stat-large">{stats.completionRate}%</div>
          <p className="stat-detail text-muted">
            {stats.completedPosts} / {stats.totalPosts} posts
          </p>
        </div>

        <div className="stat-card card shadow-m">
          <h3>Task Completion</h3>
          <div className="stat-large">{stats.taskCompletionRate}%</div>
          <p className="stat-detail text-muted">
            {stats.completedTasks} / {stats.totalTasks} tasks
          </p>
        </div>

        <div className="stat-card card shadow-m">
          <h3>Newsletters</h3>
          <div className="stat-large">
            {data.newsletters['rolands-riff']?.filter(n => n.status === 'completed').length || 0}
          </div>
          <p className="stat-detail text-muted">Roland's Riff completed</p>
        </div>

        <div className="stat-card card shadow-m">
          <h3>Podcast Episodes</h3>
          <div className="stat-large">{data.podcast.episodes.length}</div>
          <p className="stat-detail text-muted">Total episodes</p>
        </div>
      </div>

      <div className="platform-breakdown card shadow-m">
        <h3>Platform Breakdown</h3>
        <div className="platform-stats">
          {Object.entries(stats.platformStats).map(([platform, stat]) => (
            <div key={platform} className="platform-stat-row">
              <span className="platform-name">{platform}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${stat.total ? (stat.completed / stat.total) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="platform-percentage">
                {stat.total ? Math.round((stat.completed / stat.total) * 100) : 0}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activity card shadow-m">
        <h3>Task Distribution by Tag</h3>
        <div className="tag-distribution">
          {Object.entries(
            data.tasks.reduce((acc, task) => {
              const tag = task.tag || 'untagged';
              acc[tag] = (acc[tag] || 0) + 1;
              return acc;
            }, {})
          ).map(([tag, count]) => (
            <div key={tag} className="tag-stat">
              <span className="tag-name">{tag}</span>
              <span className="tag-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;