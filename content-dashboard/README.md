# Content Management Dashboard

A comprehensive content management dashboard for tracking social media posts, newsletters, podcasts, and tasks across multiple platforms.

## Features

### 📅 Calendar View
- 4-week monthly view with sprint tracking
- Week 1: Content theme week
- Week 2: CTA (Call-to-Action) content week
- Visual completion indicators for each day
- Click any day to manage content

### 📱 Social Media Management
- Track posts across Instagram, LinkedIn, and YouTube Shorts
- Daily story tracking
- Platform-specific caption management
- Creative asset link storage
- Visual completion status

### 📰 Newsletter Tracking
- **Crazy Experiments**: Bi-weekly (every other Friday)
- **Roland's Riff**: Weekly (every Friday)
- Status tracking and link management
- Automatic scheduling reminders

### 🎙️ Podcast Management
- Business Lunch Podcast tracking
- 2x weekly episode management
- Captivate upload tracking
- YouTube and Instagram clip management
- Cross-posting to Roland's account

### ✅ Task Management
- Add tasks with custom tags (studio work, presentation, content, etc.)
- Status tracking: Pending, In Progress, Completed, Blocked
- Date-based task assignment
- Drag-and-drop support (future feature)

### 📊 Analytics Dashboard
- Overall completion rates
- Platform-specific performance
- Task distribution by tag
- Newsletter and podcast statistics

### 🎨 Design Features
- Light/Dark theme toggle
- Professional shadow design system
- Mobile-responsive layout
- Minimalist, work-focused interface

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd content-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## Usage

### Daily Workflow

1. **Morning Check-in**
   - Open the Calendar view
   - Click on today's date
   - Review pending tasks and content requirements

2. **Content Creation**
   - Upload creative assets and add links
   - Write platform-specific captions
   - Mark items as completed as you go

3. **Task Management**
   - Add new tasks as they come up
   - Tag them appropriately
   - Update status throughout the day

4. **End of Day Review**
   - Check Analytics for completion rates
   - Review tomorrow's requirements
   - Plan ahead for upcoming newsletters

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Quick search (coming soon)
- `T`: Toggle theme
- `Esc`: Close modals

## Data Storage

Currently, all data is stored locally in your browser's localStorage. Your data persists between sessions but is not synced across devices.

### Export/Import (Coming Soon)
- Export your data as JSON for backup
- Import data to restore or migrate

## Future Features

### Phase 2: Cloud Integration
- Supabase integration for data persistence
- User authentication and team collaboration
- Cross-device synchronization

### Phase 3: Automation
- Auto-posting to social platforms
- Calendar integration (Google/Outlook)
- Automated reminders and notifications
- Webhook support for external tools

### Phase 4: Advanced Features
- AI-powered caption suggestions
- Content performance analytics
- Batch scheduling
- Template library
- Team role management

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: CSS with custom shadow design system
- **State Management**: React Context API
- **Data Persistence**: LocalStorage (Supabase coming soon)
- **Date Management**: date-fns
- **Drag & Drop**: react-dnd

## Development

### Project Structure
```
src/
├── components/
│   ├── Calendar/      # Calendar views and day cards
│   ├── Content/       # Social media and content forms
│   ├── Tasks/         # Task management components
│   ├── Layout/        # Header, sidebar, layout
│   └── UI/            # Reusable UI components
├── contexts/          # React contexts for data and theme
├── hooks/             # Custom React hooks
├── utils/             # Helper functions and constants
└── styles/            # Global styles and design system
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment

For Vercel deployment:
```bash
npm i -g vercel
vercel
```

## Contributing

This is a private project for internal use. For feature requests or bug reports, please contact the development team.

## License

Private and Confidential - All Rights Reserved

---

Built with care for efficient content management