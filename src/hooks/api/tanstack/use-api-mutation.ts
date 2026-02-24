import { apiClient } from '@/lib/api/api-client';
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { ApiError } from '@/types/api';

/**
 * Hook for POST/PUT/PATCH/DELETE requests with automatic cache invalidation
 *
 * @example
 * // Create user (POST)
 * const createUser = useApiMutation({
 *   endpoint: '/users',
 *   method: 'POST',
 *   invalidateQueries: [['users']], // Refresh users list after creating
 *   onSuccess: (data) => {
 *     toast.success('User created!');
 *   },
 * });
 * createUser.mutate({ name: 'John', email: 'john@example.com' });
 *
 * @example
 * // Update user (PUT)
 * const updateUser = useApiMutation({
 *   endpoint: `/users/${userId}`,
 *   method: 'PUT',
 *   invalidateQueries: [['users'], ['user', userId]],
 * });
 * updateUser.mutate({ name: 'Jane' });
 *
 * @example
 * // Delete user (DELETE)
 * const deleteUser = useApiMutation({
 *   endpoint: `/users/${userId}`,
 *   method: 'DELETE',
 *   invalidateQueries: [['users']],
 * });
 * deleteUser.mutate();
 */

export function useApiMutation<TData = unknown, TVariables = unknown>({
  endpoint,
  method = 'POST',
  invalidateQueries,
  options,
}: {
  endpoint: string | ((variables: TVariables) => string);
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  invalidateQueries?: unknown[][];
  options?: UseMutationOptions<TData, ApiError, TVariables>;
}) {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint;

      switch (method) {
        case 'POST':
          return apiClient.post<TData>(url, variables);
        case 'PUT':
          return apiClient.put<TData>(url, variables);
        case 'PATCH':
          return apiClient.patch<TData>(url, variables);
        case 'DELETE':
          return apiClient.delete<TData>(url);
        default:
          throw new Error('Invalid method');
      }
    },

    onSuccess: (data, variables, context, mutationContext) => {
      invalidateQueries?.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));

      options?.onSuccess?.(data, variables, context, mutationContext);
    },

    ...options,
  });
}
