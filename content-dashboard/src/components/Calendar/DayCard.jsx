import React, { useState } from 'react';
import { isToday, isFriday, format } from 'date-fns';
import { useData } from '../../contexts/SupabaseDataContext';
import { isNewsletterDay, formatDay, formatShortWeekday } from '../../utils/dateHelpers';
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from '../UI/SocialIcons';
import ContentModal from '../Content/ContentModal';
import './DayCard.css';

const DayCard = ({ date }) => {
  const { getDayCompletion, getTasks, getNewsletter, getPost } = useData();
  const [showModal, setShowModal] = useState(false);

  const completion = getDayCompletion(date);
  const tasks = getTasks(date);
  const isCurrentDay = isToday(date);

  // Get Instagram stories status
  const storiesData = getPost(date, 'stories');

  // Check for newsletters
  const newsletters = [];
  if (isFriday(date)) {
    newsletters.push({ type: 'rolands-riff', name: "Roland's Riff" });
    if (isNewsletterDay(date, 'crazy-experiments')) {
      newsletters.push({ type: 'crazy-experiments', name: 'Crazy Experiments' });
    }
  }

  // Calculate completion percentage (Instagram includes stories)
  const totalItems = completion.platforms.length + newsletters.length; // platforms (Instagram includes stories) + newsletters
  const completedItems =
    completion.platforms.filter(p => {
      // Instagram is complete only if both post and stories are done
      if (p.name === 'instagram') {
        return p.done && storiesData?.done;
      }
      return p.done;
    }).length +
    newsletters.filter(n => {
      const newsletterData = getNewsletter(n.type, date);
      return newsletterData.status === 'completed';
    }).length;

  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <>
      <div
        className={`day-card ${isCurrentDay ? 'today' : ''} ${completion.allComplete ? 'complete' : ''}`}
        onClick={() => setShowModal(true)}
      >
        <div className="day-header">
          <span className="day-date">{format(date, 'MMM d')}</span>
          <span className="day-name">{formatShortWeekday(date)}</span>
        </div>

        <div className="day-content">
          {/* Completion indicator */}
          <div className="completion-indicator">
            <div className="completion-bar">
              <div
                className="completion-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="completion-text tiny">{completionPercentage}%</span>
          </div>

          {/* Platform status with icons */}
          <div className="platform-status">
            {completion.platforms.map(platform => {
              const isInstagramComplete = platform.name === 'instagram' ?
                platform.done && storiesData?.done : platform.done;

              return (
                <div
                  key={platform.name}
                  className={`platform-icon-wrapper ${isInstagramComplete ? 'done' : 'pending'}`}
                  title={
                    platform.name === 'instagram' ?
                      `Instagram (Post: ${platform.done ? '✓' : '✗'}, Stories: ${storiesData?.done ? '✓' : '✗'})` :
                      platform.name
                  }
                >
                  {platform.name === 'instagram' && <InstagramIcon size={16} />}
                  {platform.name === 'linkedin' && <LinkedInIcon size={16} />}
                  {platform.name === 'youtube' && <YouTubeIcon size={16} />}
                </div>
              );
            })}
          </div>

          {/* Newsletters */}
          {newsletters.length > 0 && (
            <div className="day-newsletters">
              {newsletters.map(newsletter => (
                <div key={newsletter.type} className="newsletter-badge tiny">
                  {newsletter.name === 'Crazy Experiments' ? 'CE' : 'RR'}
                </div>
              ))}
            </div>
          )}

          {/* Tasks count */}
          {tasks.length > 0 && (
            <div className="task-count">
              <span className="tiny">{tasks.length} tasks</span>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ContentModal
          date={date}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default DayCard;