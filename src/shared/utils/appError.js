const APP_ERROR_EVENT = "coreflow:app-error";
const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";
const DEDUP_MS = 900;

let lastMessage = "";
let lastAt = 0;

const pickMessageFromResponseData = (data) => {
  if (!data) return "";
  if (typeof data === "string") return data.trim();
  if (typeof data !== "object") return "";

  if (typeof data.responseMessage === "string" && data.responseMessage.trim()) {
    return data.responseMessage.trim();
  }
  if (typeof data.message === "string" && data.message.trim()) {
    return data.message.trim();
  }
  if (typeof data.error === "string" && data.error.trim()) {
    return data.error.trim();
  }
  if (Array.isArray(data.errors) && data.errors.length) {
    const first = data.errors[0];
    if (typeof first === "string" && first.trim()) return first.trim();
    if (typeof first?.message === "string" && first.message.trim()) return first.message.trim();
  }

  return "";
};

export const extractErrorMessage = (error, fallback = DEFAULT_ERROR_MESSAGE) => {
  if (typeof error === "string" && error.trim()) return error.trim();

  const responseDataMessage = pickMessageFromResponseData(error?.response?.data);
  if (responseDataMessage) return responseDataMessage;

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
};

const canEmit = (message) => {
  const now = Date.now();
  if (message === lastMessage && now - lastAt < DEDUP_MS) {
    return false;
  }
  lastMessage = message;
  lastAt = now;
  return true;
};

export const emitAppError = (error, fallback) => {
  if (typeof window === "undefined") return;
  const message = extractErrorMessage(error, fallback);
  if (!message || !canEmit(message)) return;

  window.dispatchEvent(
    new CustomEvent(APP_ERROR_EVENT, {
      detail: {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        message,
      },
    })
  );
};

export const onAppError = (handler) => {
  if (typeof window === "undefined") return () => {};

  const listener = (event) => {
    handler?.(event?.detail);
  };

  window.addEventListener(APP_ERROR_EVENT, listener);
  return () => window.removeEventListener(APP_ERROR_EVENT, listener);
};

