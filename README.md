# BloxTax Transactions Dashboard

A full-stack transactions dashboard built with Bun, React, TypeScript, SQLite, and Drizzle ORM.

## Features

- Server-side pagination
- Server-side sorting
- Excel export (current page or full dataset)
- Responsive UI for desktop and mobile
- Error and empty states
- SQLite database with Drizzle ORM

## Tech Stack

### Backend
- Bun
- SQLite
- Drizzle ORM

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Installation

```bash
bun install
```
## Start the Project
bun run src/index.ts
Then open:
http://localhost:3000

## API Endpoints
### Get Transactions
GET /api/transactions
Query Parameters:
- page
- pageSize
- sortBy
- sortDir
### Example:
/api/transactions?page=1&pageSize=10&sortBy=date&sortDir=desc

## Export Transactions
GET /api/transactions/export
Query Parameters:
- scope=current|all
- page
- pageSize
- sortBy
- sortDir
### Example:
/api/transactions/export?scope=current&page=1&pageSize=10

## Notes

Excel export was implemented without third-party Excel libraries, according to the assignment requirements.