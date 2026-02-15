import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import { QueryOptions } from './types';
import { ApiError, QueryParams } from '@/types/api';

export function useApiQuery<TData>({
  endpoint,
  queryKey,
  params,
  options,
}: {
  endpoint: string;
  queryKey: unknown[];
  params?: QueryParams;
  options?: QueryOptions<TData>;
}) {
  return useQuery<TData, ApiError>({
    queryKey: params ? [...queryKey, params] : queryKey,
    queryFn: () => apiClient.get<TData>(endpoint, params),
    ...options,
  });
}
