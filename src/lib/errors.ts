export const getErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'An unknown error occurred.';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object') {
    const err = error as { message?: unknown; details?: unknown; hint?: unknown };
    const message = typeof err.message === 'string' && err.message.trim().length > 0 ? err.message : null;
    const details = typeof err.details === 'string' && err.details.trim().length > 0 ? err.details : null;
    const hint = typeof err.hint === 'string' && err.hint.trim().length > 0 ? err.hint : null;

    const composed = [message, details, hint].filter(Boolean).join(' — ');
    if (composed.length > 0) {
      return composed;
    }
  }

  return 'An unknown error occurred.';
};
