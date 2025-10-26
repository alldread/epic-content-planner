# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Epic Content Planner is a comprehensive content management dashboard for tracking social media posts, newsletters, podcasts, and tasks across multiple platforms. Built for Roland Frasier's Epic content strategy using a sprint-based approach.

## Development Rules

### CRITICAL: Only implement what is explicitly requested
- Make ONLY the changes asked for - nothing else
- Do NOT remove, modify, or "improve" existing features unless specifically requested
- Do NOT make assumptions about what would be "better"
- If something seems unclear, ask for clarification instead of guessing

When fixing bugs: Fix only the reported issue. Leave everything else exactly as it is.

### Technical Approach
- When searching for solutions, include "2025" in search queries for current information
- Prefer time-tested, well-documented solutions that are proven in production
- It's okay to use newer features if they're stable and well-supported
- Priority is always: it works reliably > it's cutting edge

## Tech Stack
- **Framework**: React 19.1.1 with Vite 7.1.7
- **Language**: JavaScript ES2020+ (not TypeScript)
- **State Management**: React Context API (DataContext and ThemeContext)
- **Data Persistence**: LocalStorage (Supabase integration planned)
- **Key Libraries**: framer-motion, react-dnd, date-fns

## Development Commands

### IMPORTANT: Starting the Local Development Server

**The application code is in the `content-dashboard/` subdirectory**, not the root directory. Always navigate there first:

```bash
# Navigate to the correct directory FIRST
cd content-dashboard

# Then start the development server
npm run dev
```

The server will start on port 5173 and display:
```
➜  Local:   http://localhost:5173/
```

#### Troubleshooting Server Issues

If `npm run dev` appears to hang or doesn't work:

1. **Check if a server is already running:**
   ```bash
   # Check if port 5173 is in use
   lsof -i :5173

   # If you see a process, the server is already running!
   # Just open http://localhost:5173 in your browser
   ```

2. **Kill existing server and restart:**
   ```bash
   # Find the process ID (PID)
   ps aux | grep vite

   # Kill it (replace PID with actual number)
   kill PID

   # Navigate to correct directory and restart
   cd content-dashboard
   npm run dev
   ```

3. **Always run from `content-dashboard/` directory:**
   - The app is NOT in the root `/epic-content-planner/` directory
   - It's in `/epic-content-planner/content-dashboard/`
   - All npm commands must be run from this subdirectory

### Other Development Commands

```bash
# Build for production (outputs to dist/)
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview

# Install dependencies
npm install
```

## Architecture

### Directory Structure
The main application is in `content-dashboard/`:
- `src/components/` - Feature-based component organization (Calendar, Content, Tasks, Analytics, etc.)
- `src/contexts/` - DataContext (all app data) and ThemeContext (dark/light mode)
- `src/hooks/` - Custom React hooks (useLocalStorage)
- `src/utils/` - Helper functions and constants
- `src/styles/` - Global CSS and design system

### State Management Pattern
The application uses React Context for state management with two main contexts:

1. **DataContext** manages all application data:
   - Social posts (Instagram, LinkedIn, YouTube Shorts)
   - Newsletters (Crazy Experiments, Roland's Riff)
   - Tasks with status workflow (pending, in-progress, completed, blocked)
   - Podcast episodes and clips
   - Sprint focuses and weekly scheduling

2. **ThemeContext** manages UI theme (dark/light mode)

### Navigation
The app uses view-based navigation (no react-router). Main views: calendar, tasks, analytics, settings - controlled by `activeView` state in App.jsx.

### Data Persistence
Currently uses localStorage with key `content-dashboard`. Data structure includes posts, newsletters, tasks, podcast content, sprint focuses, and weekly schedules.

## Sprint System
- **2-week sprints**: Week 1 for content theme, Week 2 for CTA content
- **10 Sprint Focuses**: Predefined Epic business offerings
- **Weekly Tracking**: Landing pages, offer pages, and CTA week designation

## Design System
Custom design tokens in `globals.css`:
- Typography scale (h1-h3, p, small, tiny)
- OKLCH color system with light/dark themes
- Shadow system (shadow-s, shadow-m, shadow-l)
- Spacing scale (xs through 2xl)
- Font: Manrope from Google Fonts

## Testing
No test framework currently configured. When adding tests, use Vitest (Vite's native test runner) with React Testing Library.

## Deployment
Configured for Vercel deployment:
- Build command: `npm run build`
- Output directory: `dist/`
- No environment variables needed (localStorage-based)

## Key Implementation Details

### Adding New Features
- Components go in appropriate feature directory under `src/components/`
- Add data management functions to DataContext
- Use existing UI components from `src/components/UI/`
- Follow existing CSS module pattern for styling

### Working with Data
- All data operations through DataContext methods
- Data automatically persists to localStorage
- Date handling uses date-fns library
- Use ISO date strings (YYYY-MM-DD) as keys for calendar data

### Common Patterns
- Functional components with hooks (no class components)
- Controlled form inputs with local state
- Modal dialogs use UI/Modal component
- Drag-and-drop uses react-dnd library

## Future Roadmap (Documented)
- **Phase 2**: Supabase integration for cloud persistence
- **Phase 3**: Auto-posting, calendar integration, webhooks
- **Phase 4**: AI suggestions, analytics, templates, team features