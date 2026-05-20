import {
  getExportScope,
  getPaginationParams,
  getSearchParams,
  getSortParams,
} from "./query-params";
import { getTransactions, getTransactionsForExport } from "./service";
import { createExcelHtml } from "./export";
import { excelResponse, internalServerError } from "../utils/http";

export const transactionsRoutes = {
  "/api/transactions": async (req: Request) => {
    try {
      const url = new URL(req.url);

      const { page, pageSize, offset } = getPaginationParams(url);
      const { sortDir, sortColumn } = getSortParams(url);
      const search = getSearchParams(url);

      const result = await getTransactions({
        page,
        pageSize,
        offset,
        sortDir,
        sortColumn,
        search,
      });

      return Response.json(result);
    } catch (error) {
      return internalServerError(error);
    }
  },

  "/api/transactions/export": async (req: Request) => {
    try {
      const url = new URL(req.url);

      const scope = getExportScope(url);
      const { pageSize, offset } = getPaginationParams(url);
      const { sortDir, sortColumn } = getSortParams(url);
      const search = getSearchParams(url);

      const rows = await getTransactionsForExport({
        scope,
        pageSize,
        offset,
        sortDir,
        sortColumn,
        search,
      });

      const html = createExcelHtml(rows);
      return excelResponse(html, scope);
    } catch (error) {
      return internalServerError(error);
    }
  },
};
