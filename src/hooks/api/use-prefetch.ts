import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import { QueryParams } from '@/types/api';

/**
 * Hook to prefetch data before it's needed (for better UX)
 *
 * @example
 * const prefetch = usePrefetch();
 *
 * // Prefetch on hover
 * <Link
 *   href="/users/123"
 *   onMouseEnter={() => prefetch({
 *     endpoint: '/users/123',
 *     queryKey: ['user', 123],
 *   })}
 * >
 *   View User
 * </Link>
 */

export function usePrefetch() {
  const queryClient = useQueryClient();

  return async <TData = unknown>({
    endpoint,
    queryKey,
    params,
  }: {
    endpoint: string;
    queryKey: unknown[];
    params?: QueryParams;
  }) => {
    await queryClient.prefetchQuery({
      queryKey: params ? [...queryKey, params] : queryKey,
      queryFn: () => apiClient.get<TData>(endpoint, params),
      staleTime: 5 * 60 * 1000,
    });
  };
}
