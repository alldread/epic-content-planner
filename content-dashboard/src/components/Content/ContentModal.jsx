import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../UI/Modal';
import SocialPostForm from './SocialPostForm';
import TaskList from '../Tasks/TaskList';
import { useData } from '../../contexts/DataContext';
import { formatDateDisplay, isNewsletterDay, isFriday, isTuesday, isThursday } from '../../utils/dateHelpers';
import { InstagramIcon } from '../UI/SocialIcons';
import './ContentModal.css';

const ContentModal = ({ date, onClose }) => {
  const [activeTab, setActiveTab] = useState('roland-instagram');
  const { updateNewsletter, getNewsletter } = useData();

  const tabs = [
    { id: 'roland-instagram', label: 'Roland Frasier', icon: <InstagramIcon size={16} /> },
    { id: 'bl-instagram', label: 'Business Lunch', icon: <InstagramIcon size={16} /> },
    { id: 'other-social', label: 'Other Social' },
    { id: 'newsletters', label: 'Newsletters' },
    { id: 'podcast', label: 'Podcast' },
    { id: 'tasks', label: 'Tasks' }
  ];

  // Check for newsletters on this day
  const newsletters = [];
  if (isFriday(date)) {
    newsletters.push({ type: 'rolands-riff', name: "Roland's Riff" });
    if (isNewsletterDay(date, 'crazy-experiments')) {
      newsletters.push({ type: 'crazy-experiments', name: 'Crazy Experiments' });
    }
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={formatDateDisplay(date)}
      size="large"
    >
      <div className="content-modal">
        <div className="modal-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="modal-tab-content">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeTab === 'roland-instagram' && (
              <motion.div
                key="roland-instagram"
                className="social-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeInOut" },
                  layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
                layout
              >
                <SocialPostForm date={date} platform="instagram" />
              </motion.div>
            )}

            {activeTab === 'bl-instagram' && (
              <motion.div
                key="bl-instagram"
                className="social-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeInOut" },
                  layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
                layout
              >
                {(isTuesday(date) || isThursday(date)) ? (
                  <SocialPostForm date={date} platform="instagram-business-lunch" />
                ) : (
                  <p className="text-muted">Business Lunch Instagram posts are only scheduled on Tuesdays and Thursdays.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'other-social' && (
              <motion.div
                key="other-social"
                className="social-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeInOut" },
                  layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
                layout
              >
                <SocialPostForm date={date} platform="linkedin" />
                <SocialPostForm date={date} platform="youtube" />
              </motion.div>
            )}

            {activeTab === 'newsletters' && (
              <motion.div
                key="newsletters"
                className="newsletter-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeInOut" },
                  layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
                layout
              >
                {newsletters.length > 0 ? (
                  newsletters.map(newsletter => {
                    const data = getNewsletter(newsletter.type, date);
                    return (
                      <div key={newsletter.type} className="newsletter-item card">
                        <h3>{newsletter.name}</h3>
                        <div className="newsletter-form">
                          <label>
                            <span>Status:</span>
                            <select
                              value={data.status || 'pending'}
                              onChange={(e) => updateNewsletter(
                                newsletter.type,
                                date,
                                { status: e.target.value }
                              )}
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </label>
                          <label>
                            <span>Link:</span>
                            <input
                              type="url"
                              placeholder="Newsletter link..."
                              value={data.link || ''}
                              onChange={(e) => updateNewsletter(
                                newsletter.type,
                                date,
                                { link: e.target.value }
                              )}
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted">No newsletters scheduled for this day.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'podcast' && (
              <motion.div
                key="podcast"
                className="podcast-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeInOut" },
                  layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
                layout
              >
                {(isTuesday(date) || isThursday(date)) ? (
                  <PodcastForm date={date} />
                ) : (
                  <p className="text-muted">Podcasts are only posted on Tuesdays and Thursdays.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'tasks' && (
              <motion.div
                key="tasks"
                className="tasks-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeInOut" },
                  layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                }}
                layout
              >
                <TaskList date={date} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};

const PodcastForm = ({ date }) => {
  const { addPodcastEpisode, addPodcastClip, data } = useData();
  const [episodeData, setEpisodeData] = useState({
    title: '',
    captivateLink: '',
    youtubeLink: '',
    showNotes: '',
    status: 'pending'
  });

  const handleAddEpisode = () => {
    if (episodeData.title) {
      addPodcastEpisode({
        ...episodeData,
        date: formatDateDisplay(date)
      });
      setEpisodeData({
        title: '',
        captivateLink: '',
        youtubeLink: '',
        showNotes: '',
        status: 'pending'
      });
    }
  };

  const episodes = data.podcast.episodes.filter(
    ep => ep.date === formatDateDisplay(date)
  );

  return (
    <div className="podcast-form">
      <h3>Business Lunch Podcast</h3>

      <div className="episode-form card">
        <h4>Add Episode</h4>
        <input
          type="text"
          placeholder="Episode title..."
          value={episodeData.title}
          onChange={(e) => setEpisodeData({ ...episodeData, title: e.target.value })}
        />
        <textarea
          placeholder="Show notes..."
          value={episodeData.showNotes}
          onChange={(e) => setEpisodeData({ ...episodeData, showNotes: e.target.value })}
          rows={4}
        />
        <input
          type="url"
          placeholder="Captivate link..."
          value={episodeData.captivateLink}
          onChange={(e) => setEpisodeData({ ...episodeData, captivateLink: e.target.value })}
        />
        <input
          type="url"
          placeholder="YouTube link..."
          value={episodeData.youtubeLink}
          onChange={(e) => setEpisodeData({ ...episodeData, youtubeLink: e.target.value })}
        />
        <button onClick={handleAddEpisode} className="primary">
          Add Episode
        </button>
      </div>

      {episodes.length > 0 && (
        <div className="episodes-list">
          <h4>Episodes</h4>
          {episodes.map(episode => (
            <div key={episode.id} className="episode-item card">
              <h5>{episode.title}</h5>
              <p className="small text-muted">Status: {episode.status}</p>
              {episode.showNotes && (
                <p className="show-notes">{episode.showNotes}</p>
              )}
              {episode.captivateLink && (
                <a href={episode.captivateLink} target="_blank" rel="noopener noreferrer">
                  Captivate
                </a>
              )}
              {episode.youtubeLink && (
                <a href={episode.youtubeLink} target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentModal;
