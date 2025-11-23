# URL Shortener

A modern URL shortener web application built with Next.js, TypeScript, and PostgreSQL.

## Features

- **Create Short Links**: Convert long URLs into short, shareable links
- **Custom Codes**: Optionally specify custom short codes (6-8 alphanumeric characters)
- **Click Tracking**: Track total clicks and last clicked time for each link
- **Link Management**: View, search, and delete links from the dashboard
- **Statistics**: Detailed stats page for individual links
- **Health Check**: System health and uptime monitoring

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (compatible with Neon, Vercel Postgres, etc.)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Neon account for free hosting)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Task
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database connection string:
```
DATABASE_URL=postgresql://user:password@host:5432/database
BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel + Neon

1. Create a Neon account and database at [neon.tech](https://neon.tech)
2. Get your database connection string
3. Deploy to Vercel:
   - Connect your GitHub repository
   - Add environment variables:
     - `DATABASE_URL`: Your Neon connection string
     - `BASE_URL`: Your Vercel deployment URL
   - Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Render**: Connect GitHub repo, add environment variables
- **Railway**: Connect GitHub repo, add PostgreSQL service, configure env vars

## API Endpoints

- `POST /api/links` - Create a new short link
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get stats for a specific link
- `DELETE /api/links/:code` - Delete a link
- `GET /healthz` - Health check endpoint

## Pages

- `/` - Dashboard (list, add, delete links)
- `/code/:code` - Statistics page for a specific link
- `/:code` - Redirect to original URL (302)
- `/healthz` - Health check

## Code Validation

Short codes must follow the pattern: `[A-Za-z0-9]{6,8}` (6-8 alphanumeric characters).

## License

MIT

