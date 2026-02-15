import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import { ApiError, QueryParams } from '@/types/api';

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  totalPages: number;
}

/**
 * Hook for paginated/infinite scroll data with automatic next page loading
 *
 * @example
 * // Infinite scroll posts
 * const {
 *   data,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage,
 * } = useApiInfiniteQuery({
 *   endpoint: '/posts',
 *   queryKey: ['posts'],
 *   params: { limit: 10 },
 * });
 *
 * // Load more button
 * <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
 *   {isFetchingNextPage ? 'Loading...' : 'Load More'}
 * </button>
 *
 * @example
 * // With filters
 * const { data } = useApiInfiniteQuery({
 *   endpoint: '/posts',
 *   queryKey: ['posts', { category: 'tech' }],
 *   params: { category: 'tech', limit: 20 },
 * });
 */

export function useApiInfiniteQuery<T>({
  endpoint,
  queryKey,
  params,
}: {
  endpoint: string;
  queryKey: unknown[];
  params?: QueryParams;
}) {
  return useInfiniteQuery<PaginatedResponse<T>, ApiError, PaginatedResponse<T>, unknown[], number>({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      apiClient.get<PaginatedResponse<T>>(endpoint, {
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}
