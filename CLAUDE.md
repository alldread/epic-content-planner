# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Epic Content Planner is a comprehensive content management dashboard for tracking social media posts, newsletters, podcasts, and tasks across multiple platforms. Built for Roland Frasier's Epic content strategy using a sprint-based approach.

## Tech Stack
- **Framework**: React 19.1.1 with Vite 7.1.7
- **Language**: JavaScript ES2020+ (not TypeScript)
- **State Management**: React Context API (DataContext and ThemeContext)
- **Data Persistence**: LocalStorage (Supabase integration planned)
- **Key Libraries**: framer-motion, react-dnd, date-fns

## Development Commands

```bash
# Start development server (port 5173)
npm run dev

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