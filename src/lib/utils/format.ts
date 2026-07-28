import { format, formatDistanceToNow } from "date-fns";

export function formatPrice(price: string | number): string {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch (error) {
    return dateString;
  }
}

export function formatRelativeTime(dateString: string): string {
  if (!dateString) return "";
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    return dateString;
  }
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, length: number): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
