export const MAX_SEARCH_LENGTH = 30;

/** Returns an error message, or null when the search text is valid. */
export function validateSearch(value: string): string | null {
  if (value.length > MAX_SEARCH_LENGTH) return `Search must be ${MAX_SEARCH_LENGTH} characters or fewer.`;
  if (!/^[a-zA-Z0-9 .\-]*$/.test(value)) return 'Use only letters, numbers, spaces, dots or hyphens.';
  return null;
}
