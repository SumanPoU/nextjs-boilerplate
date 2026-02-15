import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to get cached query data without triggering a fetch
 *
 * @example
 * const getData = useQueryData();
 * const user = getData(['user', 123]);
 */

export function useQueryData() {
  const queryClient = useQueryClient();

  return <TData = unknown>(queryKey: unknown[]): TData | undefined => {
    return queryClient.getQueryData<TData>(queryKey);
  };
}
