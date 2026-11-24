/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Compares two objects and returns an object containing only the properties that differ
 * @param current Current object to compare
 * @param next New object to compare against
 * @returns Object containing only the changed properties and their new values
 */
export function diff<T extends Record<string, any>>(
  current: T,
  next: Partial<T>
): Partial<T> {
  const changes: Partial<T> = {};

  // Handle null/undefined cases
  if (!current || !next) return next || {};

  // Iterate through all properties in the next object
  for (const key in next) {
    const currentValue = current[key];
    const nextValue = next[key];

    // Skip if values are strictly equal
    if (currentValue === nextValue) continue;

    if (nextValue === undefined) continue;

    if (
      nextValue === null ||
      currentValue === null ||
      typeof nextValue !== "object" ||
      typeof currentValue !== "object"
    ) {
      changes[key] = nextValue;
      continue;
    }

    // Handle arrays
    if (Array.isArray(nextValue) && Array.isArray(currentValue)) {
      if (JSON.stringify(currentValue) !== JSON.stringify(nextValue)) {
        changes[key] = nextValue;
      }
      continue;
    }

    // Handle nested objects
    const nestedChanges = diff(currentValue, nextValue);
    if (Object.keys(nestedChanges).length > 0) {
      // @ts-expect-error - Tricky to type properly
      changes[key] = nestedChanges;
    }
  }

  return changes;
}
