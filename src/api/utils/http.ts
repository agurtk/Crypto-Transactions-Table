export function internalServerError(error: unknown) {
  console.error(error);

  return Response.json({ message: "Internal server error" }, { status: 500 });
}

export function excelResponse(body: BodyInit, scope: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="transactions-${scope}.xls"`,
    },
  });
}
