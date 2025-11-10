# Deployment (Vercel / Netlify / Others)

This project is configured to deploy the React (Vite) frontend as a static SPA with client-side routing supported.

## Backend URL
Set your backend API URL via an environment variable:

- Variable name: `VITE_API_URL`
- Example: `https://your-backend-domain.example.com`

The frontend reads this at build time in `src/services/api.js`.

## Vercel

Already included: `vercel.json` at repository root.

- Builds using `frontend/package.json` with `@vercel/static-build`
- Output directory: `frontend/dist`
- SPA routing: rewrites all routes to `/index.html`

Steps:
1. Push this repo to GitHub.
2. In Vercel, “New Project” → import your repo.
3. No extra settings needed (the `vercel.json` is used).
4. Set Environment Variable `VITE_API_URL` (Project Settings → Environment Variables).
5. Deploy.

## Netlify

Already included: `netlify.toml` at repository root.

- Base directory: `frontend`
- Publish directory: `frontend/dist`
- Command: `npm run build`
- SPA routing: 200 redirect to `/index.html`

Steps:
1. Push this repo to GitHub.
2. In Netlify, “Add new site” → “Import an existing project”.
3. Netlify will use `netlify.toml` automatically.
4. Add Environment Variable `VITE_API_URL` (Site settings → Environment variables).
5. Deploy.

## Other Static Hosts (Render, S3/CloudFront, etc.)

- Build locally: `cd frontend && npm ci && npm run build`
- Serve the `frontend/dist` folder on your host.
- Ensure a SPA fallback to `index.html` (e.g., “Rewrite all to index.html” rule).
- Provide `VITE_API_URL` at build time if building in CI.

## Development

```bash
cd frontend
npm install
VITE_API_URL=http://127.0.0.1:8000 npm run dev
```

Open `http://localhost:5173`.

