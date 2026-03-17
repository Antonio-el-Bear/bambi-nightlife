# Bambi Platform App

Premium nightlife operations frontend built with React, TypeScript, Vite, and `react-router-dom`.

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Build the production bundle:

```bash
npm run build
```

## Deploy to Vercel

This project is ready for Vercel deployment as a static Vite app.

Vercel project settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

If you import the repository from a parent folder, set the Vercel Root Directory to:

```text
bambi-platform-app
```

## SPA Routing

This app uses `BrowserRouter`, so direct navigation to routes like `/app/bookings/BK-2401` must fall back to `index.html`.

That routing fallback is already configured in [vercel.json](./vercel.json).

## Publish Flow

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Set the Root Directory to `bambi-platform-app` if the repo contains the broader workspace.
4. Deploy.
5. Add your custom domain in the Vercel project settings if needed.
