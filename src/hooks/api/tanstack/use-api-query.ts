import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import { QueryOptions } from './types';
import { ApiError, QueryParams } from '@/types/api';

/**
 * Hook for GET requests with automatic caching and refetching
 *
 * @example
 * // Simple usage
 * const { data, isLoading, error } = useApiQuery({
 *   endpoint: '/users',
 *   queryKey: ['users'],
 * });
 *
 * @example
 * // With query parameters
 * const { data, isLoading } = useApiQuery({
 *   endpoint: '/users',
 *   queryKey: ['users', { status: 'active' }],
 *   params: { status: 'active', page: 1 },
 * });
 *
 * @example
 * // With options
 * const { data } = useApiQuery({
 *   endpoint: '/users/123',
 *   queryKey: ['user', 123],
 *   options: {
 *     enabled: !!userId, // Only run query if userId exists
 *     staleTime: 5 * 60 * 1000, // Data fresh for 5 minutes
 *   }
 * });
 */

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
