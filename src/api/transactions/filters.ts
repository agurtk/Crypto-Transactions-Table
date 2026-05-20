import { like, or } from "drizzle-orm";
import { transactions } from "../database/schema";

export function getTransactionsWhere(search: string) {
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
