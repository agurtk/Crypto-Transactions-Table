import { serve } from "bun";
import index from "./index.html";
import { db } from "./api/database";
import { transactions } from "./api/database/schema";
import { asc, count, desc, like, or } from "drizzle-orm";

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

function getPaginationParams(url: URL) {
  const page = toPositiveInteger(url.searchParams.get("page"), 1);
  const pageSize = toPositiveInteger(
    url.searchParams.get("pageSize"),
    DEFAULT_PAGE_SIZE,
  );

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
}

function getSortParams(url: URL) {
  const sortBy = url.searchParams.get("sortBy") ?? "date";
  const sortDir = url.searchParams.get("sortDir") === "asc" ? "asc" : "desc";

  const sortColumn =
    sortableColumns[sortBy as keyof typeof sortableColumns] ??
    transactions.date;

  return {
    sortDir,
    sortColumn,
  };
}

function getExportScope(url: URL) {
  return url.searchParams.get("scope") === "all" ? "all" : "current";
}

function getSearchParams(url: URL) {
  return url.searchParams.get("search")?.trim() ?? "";
}

function getTransactionsWhere(search: string) {
  if (!search) {
    return undefined;
  }

  const searchValue = `%${search}%`;

  return or(
    like(transactions.method, searchValue),
    like(transactions.network, searchValue),
    like(transactions.txHash, searchValue),
    like(transactions.buyCurrency, searchValue),
    like(transactions.buyToken, searchValue),
    like(transactions.sellCurrency, searchValue),
    like(transactions.sellToken, searchValue),
    like(transactions.senderAddress, searchValue),
    like(transactions.receiverAddress, searchValue),
    like(transactions.comments, searchValue),
  );
}

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/transactions": async (req) => {
      const url = new URL(req.url);

      const { page, pageSize, offset } = getPaginationParams(url);
      const { sortDir, sortColumn } = getSortParams(url);

      const search = getSearchParams(url);
      const whereClause = getTransactionsWhere(search);

      const data = await db
        .select()
        .from(transactions)
        .where(whereClause)
        .orderBy(sortDir === "asc" ? asc(sortColumn) : desc(sortColumn))
        .limit(pageSize)
        .offset(offset);

      const countResult = await db
        .select({ total: count() })
        .from(transactions)
        .where(whereClause);

      const total = countResult[0]?.total ?? 0;

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

      const scope = getExportScope(url);
      const { pageSize, offset } = getPaginationParams(url);
      const { sortDir, sortColumn } = getSortParams(url);
      const search = getSearchParams(url);
      const whereClause = getTransactionsWhere(search);

      const query = db
        .select()
        .from(transactions)
        .where(whereClause)
        .orderBy(sortDir === "asc" ? asc(sortColumn) : desc(sortColumn));

      const rows =
        scope === "current"
          ? await query.limit(pageSize).offset(offset)
          : await query;

      const html = createExcelHtml(rows);

      return new Response(html, {
        headers: {
          "Content-Type": "application/vnd.ms-excel; charset=utf-8",
          "Content-Disposition": `attachment; filename="transactions-${scope}.xls"`,
        },
      });
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
