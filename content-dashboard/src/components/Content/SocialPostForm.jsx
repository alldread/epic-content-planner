import React, { useState } from 'react';
import { useData } from '../../contexts/SupabaseDataContext';
import { PLATFORM_LABELS } from '../../utils/constants';
import { InstagramIcon, LinkedInIcon, YouTubeIcon } from '../UI/SocialIcons';
import { isTuesday, isThursday } from '../../utils/dateHelpers';
import './SocialPostForm.css';

const SocialPostForm = ({ date, platform }) => {
  const { updatePost, getPost, updateStories } = useData();

  // Only the main Roland Frasier Instagram includes stories
  const isInstagram = platform === 'instagram';
  const isBusinessLunchInstagram = platform === 'instagram-business-lunch';
  const showCarousel = isInstagram || isBusinessLunchInstagram || platform === 'linkedin';

  const data = getPost(date, platform);
  const storiesData = isInstagram ? getPost(date, 'stories') : null;

  const handleUpdate = (field, value) => {
    updatePost(date, platform, { [field]: value });
  };

  const handleStoriesUpdate = (field, value) => {
    updateStories(date, { [field]: value });
  };

  const platformLabel = PLATFORM_LABELS[platform] || platform;

  // Get the appropriate icon for each platform
  const getPlatformIcon = () => {
    switch(platform) {
      case 'instagram':
      case 'instagram-business-lunch':
        return <InstagramIcon size={20} />;
      case 'linkedin':
        return <LinkedInIcon size={20} />;
      case 'youtube':
        return <YouTubeIcon size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className={`social-post-form card ${data.done && (!isInstagram || storiesData?.done) ? 'completed' : ''}`}>
      <div className="form-header">
        <div className="platform-title">
          {getPlatformIcon()}
          <h4>{platformLabel}</h4>
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={data.done || false}
            onChange={(e) => handleUpdate('done', e.target.checked)}
          />
          <span>Post Done</span>
        </label>
      </div>

      <div className="form-content">
        {showCarousel ? (
          <>
            <div className="form-group">
              <label>
                <span className="label-text">Creative</span>
                {(data.carouselLinks || ['']).map((link, index) => (
                  <div key={index} className="creative-link-item">
                    <input
                      type="url"
                      placeholder="Creative link..."
                      value={link}
                      onChange={(e) => {
                        const newLinks = [...(data.carouselLinks || [''])];
                        newLinks[index] = e.target.value;
                        handleUpdate('carouselLinks', newLinks);
                      }}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        className="remove-link-btn"
                        onClick={() => {
                          const newLinks = (data.carouselLinks || ['']).filter((_, i) => i !== index);
                          handleUpdate('carouselLinks', newLinks);
                        }}
                        aria-label="Remove creative"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="add-link-btn"
                  onClick={() => {
                    const newLinks = [...(data.carouselLinks || ['']), ''];
                    handleUpdate('carouselLinks', newLinks);
                  }}
                >
                  + Add Creative
                </button>
              </label>
            </div>
          </>
        ) : (
          <div className="form-group">
            <label>
              <span className="label-text">Creative</span>
              <input
                type="url"
                placeholder="Creative link..."
                value={data.link || ''}
                onChange={(e) => handleUpdate('link', e.target.value)}
              />
            </label>
          </div>
        )}

        <div className="form-group">
          <label>
            <span className="label-text">Caption</span>
            <textarea
              placeholder={`${platform === 'instagram' || platform === 'instagram-business-lunch' ? 'Instagram' : platformLabel} caption...`}
              value={data.caption || ''}
              onChange={(e) => handleUpdate('caption', e.target.value)}
              rows="3"
            />
          </label>
        </div>

        {/* Instagram includes Stories section */}
        {isInstagram && (
          <>
            <div className="stories-divider">
              <span>Stories</span>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={storiesData?.done || false}
                  onChange={(e) => handleStoriesUpdate('done', e.target.checked)}
                />
                <span>Stories Done</span>
              </label>
            </div>
            <div className="form-group">
              <label>
                <span className="label-text">Story Links (comma-separated)</span>
                <input
                  type="text"
                  placeholder="Story link 1, Story link 2..."
                  value={storiesData?.links?.join(', ') || ''}
                  onChange={(e) => handleStoriesUpdate('links', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialPostForm;