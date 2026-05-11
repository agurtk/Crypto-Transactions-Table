export function formatDate(value: Date | number | string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(value);
}

export function formatAmount(
  amount: number | null,
  currency?: string | null,
  token?: string | null
) {
  if (amount == null) {
    return "-";
  }

  return `${formatNumber(amount)} ${currency ?? token ?? ""}`.trim();
}

export function formatHash(value: string | null) {
  if (!value) {
    return "-";
  }

  if (value.length <= 16) {
    return value;
  }

  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}