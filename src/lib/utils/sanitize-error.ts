import { ApiError } from "../types";

/**
 * Sanitize error messages for user-facing display.
 *
 * This utility ensures that no raw backend messages, database errors,
 * stack traces, HTTP status codes, or internal implementation details
 * are ever shown to end users. It maps known error patterns to
 * friendly, actionable messages and falls back to a safe generic message.
 */

const STATUS_MESSAGES: Record<number, string> = {
  400: "The information you provided is invalid. Please check your input and try again.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to perform this action.",
  404: "The requested resource could not be found.",
  409: "This action conflicts with an existing record. Please try a different approach.",
  413: "The file you uploaded is too large. Please try a smaller file.",
  422: "Some of the information provided is invalid. Please review and try again.",
  429: "You're making too many requests. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "We're having trouble connecting to our servers. Please try again in a moment.",
  503: "Our service is temporarily unavailable. Please try again later.",
};

/** Patterns that indicate a technical/internal error message */
const TECHNICAL_PATTERNS = [
  /prisma/i,
  /foreign key/i,
  /constraint/i,
  /unique constraint/i,
  /referenced from/i,
  /rentalrequest/i,
  /p2002/i,
  /p2003/i,
  /p2025/i,
  /database/i,
  /ECONNREFUSED/i,
  /ETIMEDOUT/i,
  /ENOTFOUND/i,
  /socket hang up/i,
  /network error/i,
  /fetch failed/i,
  /unexpected token/i,
  /syntax error/i,
  /cannot read prop/i,
  /undefined is not/i,
  /null is not/i,
  /internal server/i,
  /stack trace/i,
  /at .+\.(ts|js|tsx|jsx):\d+/i,
  /\.env/i,
  /api[_-]?key/i,
  /imgbb/i,
  /stripe.*error/i,
];

/** Specific backend messages mapped to user-friendly equivalents */
const MESSAGE_MAP: Array<{ pattern: RegExp; friendly: string }> = [
  {
    pattern: /active or pending/i,
    friendly: "This item has active or pending requests and cannot be modified right now.",
  },
  {
    pattern: /foreign key|referenced from|rentalrequest/i,
    friendly: "This item has associated records and cannot be deleted. Please resolve related requests first.",
  },
  {
    pattern: /already exists|unique constraint|p2002/i,
    friendly: "A record with this information already exists. Please try with different details.",
  },
  {
    pattern: /not found|p2025/i,
    friendly: "The requested item could not be found. It may have been removed.",
  },
  {
    pattern: /banned|suspended/i,
    friendly: "This account has been suspended. Please contact support for assistance.",
  },
  {
    pattern: /invalid credentials|incorrect password|wrong password/i,
    friendly: "Invalid email or password. Please check your credentials and try again.",
  },
  {
    pattern: /email.*already|already.*registered/i,
    friendly: "An account with this email already exists. Please try logging in instead.",
  },
  {
    pattern: /token.*expired|jwt.*expired/i,
    friendly: "Your session has expired. Please log in again.",
  },
  {
    pattern: /unauthorized|not authenticated/i,
    friendly: "Please log in to continue.",
  },
  {
    pattern: /forbidden|not authorized|access denied/i,
    friendly: "You don't have permission to perform this action.",
  },
];

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

/**
 * Convert a raw API error into a user-friendly message.
 *
 * @param error - The error object (ApiError, Error, or unknown)
 * @returns A sanitized, user-friendly error message string
 */
export function sanitizeErrorMessage(error: ApiError | Error | unknown): string {
  // 1. Handle ApiError with status codes
  if (error && typeof error === "object" && "statusCode" in error) {
    const apiError = error as ApiError;
    const rawMessage = apiError.message || "";

    // Check specific message mappings first
    for (const { pattern, friendly } of MESSAGE_MAP) {
      if (pattern.test(rawMessage)) {
        return friendly;
      }
    }

    // Check if the message looks technical
    const isTechnical = TECHNICAL_PATTERNS.some((p) => p.test(rawMessage));
    if (isTechnical) {
      return STATUS_MESSAGES[apiError.statusCode] || DEFAULT_MESSAGE;
    }

    // If the message is short, clean, and non-technical, it's likely
    // a purposeful backend message (e.g. "User not found") — still sanitize
    // by checking status code first, then allowing clean messages through
    if (apiError.statusCode && STATUS_MESSAGES[apiError.statusCode]) {
      // For server errors (5xx), always use our message
      if (apiError.statusCode >= 500) {
        return STATUS_MESSAGES[apiError.statusCode];
      }
      // For client errors with a clean backend message, allow it
      if (rawMessage && rawMessage.length < 200 && !isTechnical) {
        return rawMessage;
      }
      return STATUS_MESSAGES[apiError.statusCode];
    }

    // Fallback for ApiError without recognized status
    return rawMessage && rawMessage.length < 200 && !isTechnical
      ? rawMessage
      : DEFAULT_MESSAGE;
  }

  // 2. Handle standard Error objects
  if (error instanceof Error) {
    const msg = error.message || "";
    
    // Check specific mappings
    for (const { pattern, friendly } of MESSAGE_MAP) {
      if (pattern.test(msg)) {
        return friendly;
      }
    }

    // Check if technical
    const isTechnical = TECHNICAL_PATTERNS.some((p) => p.test(msg));
    if (isTechnical) {
      return DEFAULT_MESSAGE;
    }

    // Allow clean, short messages
    if (msg && msg.length < 200) {
      return msg;
    }

    return DEFAULT_MESSAGE;
  }

  // 3. Unknown error shape
  return DEFAULT_MESSAGE;
}
