import { EXPORT_BATCH_SIZE } from "./constants";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

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

export function createExcelHeader() {
  const headerCells = columns
    .map((column) => `<th>${escapeHtml(column)}</th>`)
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
  `;
}

export function createExcelRow(row: Record<string, unknown>) {
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
}

export function createExcelFooter() {
  return `
          </tbody>
        </table>
      </body>
    </html>
  `;
}

export function createExcelStream(rows: Record<string, unknown>[]) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(createExcelHeader()));

      for (const row of rows) {
        controller.enqueue(encoder.encode(createExcelRow(row)));
      }

      controller.enqueue(encoder.encode(createExcelFooter()));
      controller.close();
    },
  });
}

type ExcelRow = Record<string, unknown>;
type FetchBatch = (offset: number, limit: number) => Promise<ExcelRow[]>;

export function createExcelBatchStream(fetchBatch: FetchBatch) {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(createExcelHeader()));

        let offset = 0;

        while (true) {
          const rows = await fetchBatch(offset, EXPORT_BATCH_SIZE);
            console.log("fetching batch ", offset);
          if (rows.length === 0) {
            break;
          }

          for (const row of rows) {
            controller.enqueue(encoder.encode(createExcelRow(row)));
          }

          offset += rows.length;
        }

        controller.enqueue(encoder.encode(createExcelFooter()));
        controller.close();
      } catch (error) {
        console.error(error + "Error in createExcelBatchStream");
      }
    },
  });
}
