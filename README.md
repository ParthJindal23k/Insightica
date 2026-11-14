# Insightica

**Team**

| Name | ID |
| --- | --- |
| Nishit Prajapati | 20235116 |
| Parth Jindal | 20235097 |
| Prateek | 20235109 |
| Divya Kumar Jha | 20235034 |

Software Project Management course project.

Insightica is a lightweight web analytics tool. You add one script tag to a
site and get a dashboard with visitors, page views, time on site, traffic
sources, locations, devices and a live visitor count.

## Features

- Visitors, page views and active time, hourly or daily, for any date range
- Traffic sources and URL parameters
- Countries, regions and cities
- Devices, browsers and operating systems
- Live visitor count, refreshed every 10 seconds
- Several websites per account, each with its own timezone and script
- Public demo with sample data at `/demo`
- Light and dark theme, works on mobile

## Tech stack

- Next.js 16 (App Router) and React 19
- Tailwind CSS 4, Radix UI primitives, Recharts
- Clerk for authentication and billing
- Neon Postgres with Drizzle ORM

## Run it locally

```bash
npm install
```

Copy `.env.example` to `.env` and fill in the values:

| Variable | What it is |
| --- | --- |
| `NEXT_PUBLIC_NEON_DB_CONNECTION_STRING` | Neon Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_HOST_URL` | URL the app is served from, e.g. `http://localhost:3000` |

Create the tables, then start the dev server:

```bash
npx drizzle-kit push
```

```bash
npm run dev
```

Open http://localhost:3000.

## How tracking works

1. Add a website in the dashboard (domain and timezone).
2. Paste the generated `<script>` tag into the site's `<head>`.
3. `public/analytics.js` sends a page view to `/api/track` and a heartbeat to
   `/api/live` every 10 seconds. The dashboard reads from `/api/website`.

## Project structure

```
app/
  page.tsx                 landing page
  demo/                    public demo with sample data
  (auth)/                  sign-in and sign-up
  (routes)/dashboard/      websites list, add website, analytics, settings, plans
  api/                     track, live, website, user
components/analytics/      stats, chart and breakdown panels
configs/                   database schema and types
public/analytics.js        tracking script
```

## Deploy

The app deploys to Vercel as a standard Next.js project. Set the four
environment variables above in the Vercel project settings.
