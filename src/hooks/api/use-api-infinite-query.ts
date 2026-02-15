import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import { ApiError, QueryParams } from '@/types/api';

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  totalPages: number;
}

export function useApiInfiniteQuery<T>({
  endpoint,
  queryKey,
  params,
}: {
  endpoint: string;
  queryKey: unknown[];
  params?: QueryParams;
}) {
  return useInfiniteQuery<PaginatedResponse<T>, ApiError>({
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
