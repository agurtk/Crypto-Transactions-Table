# Crypto Transactions Dashboard

A full-stack crypto transactions dashboard built with modern web technologies, focused on performance, scalability, and clean architecture.

This project started as a technical assignment and evolved into a portfolio project showcasing:
- modular backend architecture
- responsive UI design
- server-side data handling
- scalable frontend/backend patterns

---

# Features

## Transactions Management

- Server-side pagination
- Server-side sorting
- Live search filtering
- Responsive desktop and mobile layouts

## Export System

- Excel export for:
  - current page
  - full dataset
- Implemented without third-party Excel libraries

## User Experience

- Delayed loading states to prevent UI flickering
- Dedicated loading, error, and empty states
- Mobile-specific responsive components
- Stable table layout for large content

---

# Tech Stack

## Backend

- Bun
- TypeScript
- SQLite
- Drizzle ORM

## Frontend

- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Tooling

- ESLint
- Git & GitHub

---

# Backend Architecture

The backend was refactored into modular layers to improve maintainability and scalability.

## Structure

```txt
src/api/transactions
├── routes.ts
├── service.ts
├── filters.ts
├── query-params.ts
├── export.ts
├── constants.ts
```

## Responsibilities

### routes.ts
- HTTP request handling
- response orchestration

### service.ts
- database access logic
- transactions queries

### filters.ts
- reusable search filtering

### query-params.ts
- pagination
- sorting
- request parameter parsing

### export.ts
- streamed Excel generation
- HTML export formatting

---

# Performance Optimizations

- Server-side pagination and sorting
- Debounced search input
- Delayed loading UI rendering
- Reduced layout shifts using fixed table layouts

---

# Installation

```bash
bun install
```

---

# Run the Project

```bash
bun run src/index.ts
```

Open:

```txt
http://localhost:3000
```

---

# API Endpoints

## Get Transactions

```txt
GET /api/transactions
```

### Query Parameters

- `page`
- `pageSize`
- `sortBy`
- `sortDir`
- `search`

### Example

```txt
/api/transactions?page=1&pageSize=10&sortBy=date&sortDir=desc
```

---

## Export Transactions

```txt
GET /api/transactions/export
```

### Query Parameters

- `scope=current|all`
- `page`
- `pageSize`
- `sortBy`
- `sortDir`
- `search`

### Example

```txt
/api/transactions/export?scope=all&search=btc
```

---

# Future Improvements

- React Query / TanStack Query integration
- Virtualized rendering for very large datasets

---

# Screenshots

<img width="1298" height="814" alt="{0AC11371-FFEE-4B77-9D10-BE1996A4CEAA}" src="https://github.com/user-attachments/assets/6966fa61-c4f1-493b-9772-ba2709b1831f" />

<img width="345" height="750" alt="{7F8E5074-2D0B-44B4-AEBB-1E44C89F07C2}" src="https://github.com/user-attachments/assets/584c2d0e-77cf-48a1-a501-aba7ae644246" />


