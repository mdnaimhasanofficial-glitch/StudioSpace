# Google Sign Up + Sign In

Google OAuth is wired through Google Identity Services (GIS): the client opens
the Google popup, obtains an ID token (JWT), and posts it to the backend, which
verifies it and returns the app's own JWT used everywhere else.

One endpoint handles both flows:

- `POST /api/auth/google` — body `{ "credential": "<google id token>" }`
  - Email already exists → **sign in** (and links `googleId` to that account on
    first Google use; password accounts keep working).
  - New email → **sign up** (user document stored without `passwordHash`).
  - Response is the same `{ token, user: { id, name, email } }` contract as
    `/register` and `/login`.

## 1. Get an OAuth Client ID

1. Go to <https://console.cloud.google.com/apis/credentials>.
2. Create → **OAuth client ID** → application type **Web application**.
3. Under **Authorized JavaScript origins** add:
   - `http://localhost:3000` (dev)
   - your production origin (e.g. `https://your-app.vercel.app`)
4. No redirect URI is needed — this flow uses the popup/credential flow.
5. Copy the client ID (`xxxxxxxx.apps.googleusercontent.com`).

## 2. Set the same client ID on both apps

```bash
# studiospace-server/.env
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com

# studiospace-client/.env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
```

Restart both dev servers after editing env files —
`NEXT_PUBLIC_*` is inlined at build/startup time.

## 3. Files involved

| App | File | Role |
| --- | --- | --- |
| server | `src/routes/auth.js` | `POST /google` — verifies token via `google-auth-library`, upserts user, signs JWT |
| client | `src/components/auth/google-button.tsx` | Loads GIS, renders the official "Continue with Google" button, posts credential |
| client | `src/lib/api.ts` | `loginWithGoogle()` request helper |
| client | `src/components/auth/auth-context.tsx` | Exposes `loginWithGoogle()` and stores the session JWT |
| client | `src/components/auth/auth-form.tsx` | Shows the Google button (above the divider) on `/login` and `/register` |

## Notes

- The Google button only renders when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set;
  the email form still works without it.
- The button is the official GIS widget (`outline` theme, `continue_with`
  text); its visual styling is controlled by Google, not our CSS.
- `verifyIdToken` checks signature + `aud` against `GOOGLE_CLIENT_ID`, and the
  handler additionally requires `email_verified`.
