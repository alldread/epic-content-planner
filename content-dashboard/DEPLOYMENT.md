# Deployment Instructions

## Current Setup

Your Epic Content Planner is now configured with:
- ✅ **Supabase Cloud Storage**: All data stored in Supabase database
- ✅ **Password Protection**: Single password "Epic2025!" for access
- ✅ **Local Development**: Environment variables in `.env.local`

## Testing Locally

1. The app is currently running at: http://localhost:5173/
2. Password to access: `Epic2025!`
3. Your existing localStorage data will be offered for migration on first login

## Deploying to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Supabase integration and password protection"
git push
```

### Step 2: Configure Vercel Environment Variables

Go to your Vercel project settings and add these environment variables:

| Variable Name | Value |
|--------------|-------|
| `VITE_SUPABASE_URL` | `https://nqbetmhexfyvmrhorpgt.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xYmV0bWhleGZ5dm1yaG9ycGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNzc1MTEsImV4cCI6MjA3NTk1MzUxMX0.hhaJbbBQPqM30kUcin4qQ546CRFw9_9y7_IdQ5rbcog` |
| `VITE_APP_PASSWORD` | `Epic2025!` |

### Step 3: Deploy
```bash
vercel --prod
```

Or trigger deployment automatically by pushing to GitHub if connected.

## Data Migration

When you first access the app after deployment:
1. Enter the password `Epic2025!`
2. If you have existing localStorage data, you'll see a migration prompt in Settings
3. Click "Migrate Now" to move your data to the cloud
4. The app will reload with your data now stored in Supabase

## Features Now Available

### Cloud Storage Benefits
- Access your data from any device
- Automatic syncing across browser tabs
- No data loss when clearing browser cache
- Scalable for future team features

### Security
- Password protection prevents unauthorized access
- Session-based authentication (clears when browser closes)
- All data operations require authentication

## Changing the Password

To change the password:
1. Update `.env.local` for local development
2. Update the environment variable in Vercel dashboard
3. Redeploy the application

## Troubleshooting

### If data doesn't load:
1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Ensure tables were created (check Supabase dashboard)

### If password doesn't work:
1. Verify the password is exactly `Epic2025!` (case-sensitive)
2. Check that environment variables are set correctly
3. Clear browser cache and try again

### If migration fails:
1. Your data is backed up in localStorage key `content-dashboard-backup`
2. Check browser console for specific error messages
3. You can retry migration by clearing `supabase-migration-done` from localStorage

## Next Steps

Future enhancements could include:
- User accounts with individual logins
- Team collaboration features
- Automated backups
- Export/import functionality
- Real-time collaboration

## Support

For issues or questions:
- Check the browser console for error messages
- Verify all environment variables are set correctly
- Ensure Supabase project is active and accessible