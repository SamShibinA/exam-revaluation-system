# Google Sign-In Setup

This guide explains how to enable Google Sign-In for the Exam Revaluation System.

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the **OAuth consent screen**:
   - Choose **External** (for testing) or **Internal** (for organization)
   - Add app name, support email, and developer contact
   - Add scopes: `email`, `profile`, `openid`
6. For **Application type**, select **Web application**
7. Add **Authorized JavaScript origins**:
   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` (if different)
   - Your production URL (e.g. `https://yourdomain.com`)
8. Click **Create** and copy the **Client ID**

## 2. Configure Environment Variables

### Frontend (`frontend/.env`)

```
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

### Backend (`backend/.env`)

```
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

Use the **same Client ID** in both files.

## 3. Restart Servers

After adding the env variables, restart both:

- Backend: `npm run dev` (in `backend/`)
- Frontend: `npm run dev` (in `frontend/`)

## 4. How It Works

- **New users**: Signing in with Google creates a new Student account (with a generated student ID)
- **Existing users**: If the email matches a Student or Admin in your database, they are logged in with that role
- **Admins**: Admins can sign in with Google only if their email already exists in the Admin collection

## Troubleshooting

- **"Google sign-in was cancelled or failed"** – Check that your domain/origin is in Authorized JavaScript origins
- **"GOOGLE_CLIENT_ID is not configured"** – Ensure both `.env` files have the Client ID set
- **401/403 from Google** – Verify the OAuth consent screen is configured and the app is in Testing mode (add test users if needed)
