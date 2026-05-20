function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function createExcelHtml(rows: Record<string, unknown>[]) {
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
