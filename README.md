# CRM

A lightweight CRM application for managing companies, contacts, and deals.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, MUI, React Router
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL via Prisma ORM

## Prerequisites

- Node.js
- PostgreSQL database

## Setup

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Create a `.env` file in the `server/` directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/crm"
   ```

3. Run database migrations:
   ```bash
   cd server && npm run db:migrate
   ```

## Development

Run the server and client in separate terminals:

```bash
npm run dev:server   # Express API on port 3000
npm run dev:client   # Vite dev server
```

## Database

```bash
cd server
npm run db:migrate    # Run migrations
npm run db:generate   # Regenerate Prisma client
npm run db:studio     # Open Prisma Studio
```

## Data Models

- **Company** — name, website, phone, address, notes
- **Contact** — first/last name, email, phone, title; optionally linked to a company
- **Deal** — title, value, close date, stage (Lead → Qualified → Proposal → Negotiation → Closed Won/Lost); linked to a company and/or contact
