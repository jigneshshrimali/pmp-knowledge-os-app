import { useEffect, useState } from "react";

interface ContentCollectionState<T> {
  items: T[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * Consumes a `{ getAll(): Promise<T[]> }` content service and exposes it
 * as simple loading/error/data state. Pages stay declarative and never
 * call the service's async methods directly.
 */
export function useContentCollection<T>(
  getAll: () => Promise<T[]>,
): ContentCollectionState<T> {
  const [state, setState] = useState<ContentCollectionState<T>>({
    items: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getAll()
      .then((items) => {
        if (!cancelled) setState({ items, isLoading: false, error: null });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ items: [], isLoading: false, error });
      });

    return () => {
      cancelled = true;
    };
    // `getAll` is a stable reference from a module-level service, so an
    // empty dependency array is intentional here rather than an oversight.
  }, []);

  return state;
}
