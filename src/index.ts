import { serve } from "bun";
import index from "./index.html";
import { db } from "./api/database";
import { transactions } from "./api/database/schema";

const DEFAULT_PAGE_SIZE = 25;

function toPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

const sortableColumns = {
  id: transactions.id,
  date: transactions.date,
  method: transactions.method,
  buyAmount: transactions.buyAmount,
  sellAmount: transactions.sellAmount,
  feeAmount: transactions.feeAmount,
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createExcelHtml(rows: Record<string, unknown>[]) {
  const columns = [
    "id",
    "method",
    "date",
    "buyAmount",
    "buyCurrency",
    "buyToken",
    "sellAmount",
    "sellCurrency",
    "sellToken",
    "feeAmount",
    "feeCurrency",
    "feeToken",
    "network",
    "txHash",
    "senderAddress",
    "receiverAddress",
    "comments",
  ];

  const headerCells = columns
    .map((column) => `<th>${escapeHtml(column)}</th>`)
    .join("");

  const bodyRows = rows
    .map((row) => {
      const cells = columns
        .map((column) => {
          const value =
            column === "date" && row[column]
              ? new Date(Number(row[column])).toLocaleString()
              : row[column];

          return `<td>${escapeHtml(value)}</td>`;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <table border="1">
          <thead>
            <tr>${headerCells}</tr>
          </thead>
          <tbody>
            ${bodyRows}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/transactions": async (req) => {
      const url = new URL(req.url);

      const page = toPositiveInteger(url.searchParams.get("page"), 1);
      const pageSize = toPositiveInteger(url.searchParams.get("pageSize"), DEFAULT_PAGE_SIZE);

      const sortBy = url.searchParams.get("sortBy") ?? "date";
      const sortDir = url.searchParams.get("sortDir") === "asc" ? "asc" : "desc";

      const sortColumn =
        sortableColumns[sortBy as keyof typeof sortableColumns] ??
        transactions.date;

      const offset = (page - 1) * pageSize;

      const total = await db.$count(transactions);

      const data = await db.query.transactions.findMany({
        limit: pageSize,
        offset,
        orderBy: (transactions, { asc, desc }) => {
          const sortableColumns = {
            id: transactions.id,
            date: transactions.date,
            method: transactions.method,
            buyAmount: transactions.buyAmount,
            sellAmount: transactions.sellAmount,
            feeAmount: transactions.feeAmount,
          };

          const sortColumn =
            sortableColumns[sortBy as keyof typeof sortableColumns] ??
            transactions.date;

          return [sortDir === "asc" ? asc(sortColumn) : desc(sortColumn)];
        },
      });

      return Response.json({
        data,
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      });
    },

    "/api/transactions/export": async (req) => {
      const url = new URL(req.url);

      const scope = url.searchParams.get("scope") ?? "current";

      const page = toPositiveInteger(url.searchParams.get("page"), 1);
      const pageSize = toPositiveInteger(url.searchParams.get("pageSize"), 10);

      const offset = (page - 1) * pageSize;

      const rows = await db.query.transactions.findMany({
        limit: scope === "current" ? pageSize : undefined,
        offset: scope === "current" ? offset : undefined,
        orderBy: (transactions, { asc, desc }) => {
          const sortBy = url.searchParams.get("sortBy") ?? "date";
          const sortDir = url.searchParams.get("sortDir") === "asc" ? "asc" : "desc";

          const sortableColumns = {
            id: transactions.id,
            date: transactions.date,
            method: transactions.method,
            buyAmount: transactions.buyAmount,
            sellAmount: transactions.sellAmount,
            feeAmount: transactions.feeAmount,
          };

          const sortColumn =
            sortableColumns[sortBy as keyof typeof sortableColumns] ??
            transactions.date;

          return [sortDir === "asc" ? asc(sortColumn) : desc(sortColumn)];
        },
      });

      const html = createExcelHtml(rows);

      return new Response(html, {
        headers: {
          "Content-Type": "application/vnd.ms-excel; charset=utf-8",
          "Content-Disposition": `attachment; filename="transactions-${scope}.xls"`,
        },
      });
    },

    "/api/data": async (req) => {
      const trxs = await db.query.transactions.findMany();
      return Response.json(trxs);
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
