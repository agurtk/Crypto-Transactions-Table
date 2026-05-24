import { transactions } from "../database/schema";

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const EXPORT_BATCH_SIZE = 1000;

export const sortableColumns = {
  id: transactions.id,
  date: transactions.date,
  method: transactions.method,
  buyAmount: transactions.buyAmount,
  sellAmount: transactions.sellAmount,
  feeAmount: transactions.feeAmount,
};
