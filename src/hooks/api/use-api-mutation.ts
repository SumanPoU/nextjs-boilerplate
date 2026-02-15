import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import { MutationOptions } from './types';
import { ApiError } from '@/types/api';

export function useApiMutation<TData, TVariables>({
  endpoint,
  method = 'POST',
  invalidateQueries,
  options,
}: {
  endpoint: string | ((variables: TVariables) => string);
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  invalidateQueries?: unknown[][];
  options?: MutationOptions<TData, TVariables>;
}) {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: (variables) => {
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

    onSuccess: (data, variables, onMutateResult, context) => {
      invalidateQueries?.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },

    ...options,
  });
}
