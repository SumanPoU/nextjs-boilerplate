import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook to manually invalidate queries (force refetch)
 *
 * @example
 * const invalidate = useInvalidateQueries();
 *
 * const handleRefresh = () => {
 *   invalidate([['users'], ['posts']]);
 * };
 */

export function useInvalidateQueries() {
  const queryClient = useQueryClient();

  return (queryKeys: unknown[][]) => {
    queryKeys.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  };
}
