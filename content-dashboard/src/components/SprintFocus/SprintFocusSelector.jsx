import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useData } from '../../contexts/DataContext';
import './SprintFocusSelector.css';

const SprintFocusSelector = ({ weekId, weekNumber }) => {
  const {
    getSprintFocuses,
    getWeekFocus,
    setWeekFocus,
    getWeekLandingPage,
    setWeekLandingPage,
    getWeekOfferPage,
    setWeekOfferPage
  } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [landingPageUrl, setLandingPageUrl] = useState('');
  const [offerPageUrl, setOfferPageUrl] = useState('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isEditingOfferUrl, setIsEditingOfferUrl] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const focuses = getSprintFocuses().filter(f => f.active);
  const currentFocusId = getWeekFocus(weekId);
  const currentFocus = focuses.find(f => f.id === currentFocusId);

  // Determine if this is a CTA week (even weeks)
  const isCtaWeek = weekNumber % 2 === 0;

  // Load the saved landing page URL and offer page URL
  useEffect(() => {
    const savedUrl = getWeekLandingPage(weekId);
    setLandingPageUrl(savedUrl);
    const savedOfferUrl = getWeekOfferPage(weekId);
    setOfferPageUrl(savedOfferUrl);
  }, [weekId, getWeekLandingPage, getWeekOfferPage]);

  const handleSelectFocus = (focusId) => {
    setWeekFocus(weekId, focusId);
    setIsOpen(false);
  };

  const handleClearFocus = () => {
    setWeekFocus(weekId, null);
    setIsOpen(false);
  };

  const handleSaveLandingPage = () => {
    // Ensure URL has a protocol
    let validatedUrl = landingPageUrl.trim();
    if (validatedUrl && !validatedUrl.match(/^https?:\/\//i)) {
      validatedUrl = 'https://' + validatedUrl;
    }
    setLandingPageUrl(validatedUrl);
    setWeekLandingPage(weekId, validatedUrl);
    setIsEditingUrl(false);
  };

  const handleSaveOfferPage = () => {
    // Ensure URL has a protocol
    let validatedUrl = offerPageUrl.trim();
    if (validatedUrl && !validatedUrl.match(/^https?:\/\//i)) {
      validatedUrl = 'https://' + validatedUrl;
    }
    setOfferPageUrl(validatedUrl);
    setWeekOfferPage(weekId, validatedUrl);
    setIsEditingOfferUrl(false);
  };

  const handleToggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      // Calculate position when opening
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4, // 4px gap below button
        left: rect.left,
        width: Math.max(320, rect.width) // Ensure minimum width
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="sprint-focus-selector">
      <div className="focus-selector-row">
        <button
          ref={buttonRef}
          className="focus-selector-button"
          onClick={handleToggleDropdown}
          style={{
            backgroundColor: currentFocus?.color || 'var(--bg-light)',
            borderColor: currentFocus?.color || 'var(--bg-light)'
          }}
        >
          <span className="focus-label">
            {currentFocus ? currentFocus.name : 'Select Focus'}
          </span>
          <span className="dropdown-arrow">▼</span>
        </button>

        {/* Show landing page field when a focus is selected */}
        {currentFocus && (
          <>
            <div className="landing-page-field">
              {isEditingUrl ? (
                <div className="url-input-group">
                  <input
                    type="url"
                    value={landingPageUrl}
                    onChange={(e) => setLandingPageUrl(e.target.value)}
                    placeholder="https://example.com/landing"
                    className="url-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveLandingPage();
                      if (e.key === 'Escape') setIsEditingUrl(false);
                    }}
                  />
                  <button
                    onClick={handleSaveLandingPage}
                    className="url-save-btn"
                    title="Save URL"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setIsEditingUrl(false)}
                    className="url-cancel-btn"
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className="url-display"
                  onClick={() => setIsEditingUrl(true)}
                  title="Click to edit landing page URL"
                >
                  {landingPageUrl ? (
                    <>
                      <span className="url-label">Landing:</span>
                      <a
                        href={landingPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="landing-page-link"
                      >
                        {(() => {
                          // Remove protocol for display
                          const displayUrl = landingPageUrl.replace(/^https?:\/\//, '');
                          return displayUrl.length > 30
                            ? displayUrl.substring(0, 30) + '...'
                            : displayUrl;
                        })()}
                      </a>
                    </>
                  ) : (
                    <span className="url-placeholder">+ Add landing page URL</span>
                  )}
                </div>
              )}
            </div>

            <div className="landing-page-field">
              {isEditingOfferUrl ? (
                <div className="url-input-group">
                  <input
                    type="url"
                    value={offerPageUrl}
                    onChange={(e) => setOfferPageUrl(e.target.value)}
                    placeholder="https://example.com/offer"
                    className="url-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveOfferPage();
                      if (e.key === 'Escape') setIsEditingOfferUrl(false);
                    }}
                  />
                  <button
                    onClick={handleSaveOfferPage}
                    className="url-save-btn"
                    title="Save URL"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setIsEditingOfferUrl(false)}
                    className="url-cancel-btn"
                    title="Cancel"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  className="url-display"
                  onClick={() => setIsEditingOfferUrl(true)}
                  title="Click to edit offer page URL"
                >
                  {offerPageUrl ? (
                    <>
                      <span className="url-label">Offer:</span>
                      <a
                        href={offerPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="landing-page-link"
                      >
                        {(() => {
                          // Remove protocol for display
                          const displayUrl = offerPageUrl.replace(/^https?:\/\//, '');
                          return displayUrl.length > 30
                            ? displayUrl.substring(0, 30) + '...'
                            : displayUrl;
                        })()}
                      </a>
                    </>
                  ) : (
                    <span className="url-placeholder">+ Add offer page URL</span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isOpen && createPortal(
        <>
          <div className="focus-dropdown-overlay" onClick={() => setIsOpen(false)} />
          <div
            className="focus-dropdown shadow-l"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              minWidth: `${dropdownPosition.width}px`
            }}
          >
            <div className="dropdown-header">
              <h4>Select Sprint Focus for Week {weekNumber}</h4>
            </div>
            <div className="focus-options">
              <div
                className={`focus-option ${!currentFocusId ? 'selected' : ''}`}
                onClick={handleClearFocus}
              >
                <div
                  className="focus-color-indicator"
                  style={{ backgroundColor: 'var(--bg-light)' }}
                />
                <div className="focus-info">
                  <h5>No Focus</h5>
                  <p className="focus-description tiny">Clear the sprint focus for this week</p>
                </div>
              </div>
              {focuses.map(focus => (
                <div
                  key={focus.id}
                  className={`focus-option ${currentFocusId === focus.id ? 'selected' : ''}`}
                  onClick={() => handleSelectFocus(focus.id)}
                >
                  <div
                    className="focus-color-indicator"
                    style={{ backgroundColor: focus.color }}
                  />
                  <div className="focus-info">
                    <h5>{focus.name}</h5>
                    <p className="focus-description tiny">{focus.description}</p>
                    {focus.products && focus.products.length > 0 && (
                      <div className="focus-products">
                        {focus.products.slice(0, 3).map((product, idx) => (
                          <span key={idx} className="product-tag tiny">
                            {product}
                          </span>
                        ))}
                        {focus.products.length > 3 && (
                          <span className="product-tag tiny">
                            +{focus.products.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default SprintFocusSelector;