
# Insightica

**Team Members**

| Name | ID |
|---|---|
| Nishit Prajapati | 202351106 |
| Parth Jindal | 202351097 |
| Prateek | 202351109 |
| Divya Kumar Jha | 202351034 |

*Software Project Management – Course Project*

## About the Project

Insightica is a lightweight and user-friendly web analytics platform designed to help website owners understand their website traffic and visitor behaviour. By adding a single tracking script to a website, users can access an interactive dashboard displaying visitor statistics, page views, traffic sources, geographical locations, devices, and real-time visitor activity.

## Features

- Track visitors, page views, and active time with hourly and daily analytics.
- Monitor traffic sources and URL parameters.
- View visitor locations, including countries, regions, and cities.
- Analyze devices, browsers, and operating systems.
- Monitor live visitors with automatic updates every 10 seconds.
- Manage multiple websites under a single account.
- Access a public demo with sample analytics data at `/demo`.
- Responsive dashboard with light and dark themes.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS 4, Radix UI primitives
- **Charts:** Recharts
- **Authentication & Billing:** Clerk
- **Database:** Neon PostgreSQL
- **ORM:** Drizzle ORM

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ParthJindal23k/Insightica.git
cd Insightica
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and provide the required credentials.

| Variable | Description |
|---|---|
| `NEON_DB_CONNECTION_STRING` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_HOST_URL` | Application URL, e.g. `http://localhost:3000` |

### 4. Set up the database

```bash
npx drizzle-kit push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How Tracking Works

1. Add a website through the dashboard by providing its domain and timezone.
2. Copy the generated tracking `<script>` tag and add it to the website's `<head>` section.
3. The tracking script (`public/analytics.js`) automatically collects page views and sends heartbeat requests every 10 seconds.
4. The collected information is processed through `/api/track` and `/api/live`.
5. The dashboard retrieves and displays the analytics through `/api/website`.

## Project Structure

```text
app/
  page.tsx                  Landing page
  demo/                     Public demo with sample data
  (auth)/                   Sign-in and sign-up
  (routes)/dashboard/       Dashboard, analytics and settings
  api/                      Tracking and data APIs

components/analytics/       Statistics, charts and breakdown panels
configs/                    Database schema and configurations
public/analytics.js         Website tracking script
```

## Deployment

Insightica can be deployed on [Vercel](https://vercel.com/) as a standard Next.js application.

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables in project settings.
3. Deploy the application.

Once deployed, the analytics dashboard will be accessible through your configured application URL.

---

**Insightica – Making Website Analytics Simple and Accessible.**
