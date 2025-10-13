import React from 'react';

export const InstagramIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill={color}/>
  </svg>
);

export const LinkedInIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="2" y="9" width="4" height="12" stroke={color} strokeWidth="2"/>
    <circle cx="4" cy="4" r="2" stroke={color} strokeWidth="2"/>
  </svg>
);

export const YouTubeIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polygon
      points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Combined Instagram + Stories icon
export const InstagramStoriesIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill={color}/>
    {/* Stories indicator - ring around the icon */}
    <rect
      x="0.5"
      y="0.5"
      width="23"
      height="23"
      rx="6"
      stroke={color}
      strokeWidth="1"
      strokeDasharray="3 2"
      opacity="0.5"
    />
  </svg>
);