import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/api-client';
import { ApiError } from '@/types/api';

interface Context<TData> {
  previousData?: TData;
}

/**
 * Hook for mutations with optimistic updates (instant UI updates before server response)
 *
 * @example
 * // Like a post optimistically
 * const likePost = useOptimisticMutation({
 *   endpoint: `/posts/${postId}/like`,
 *   method: 'POST',
 *   queryKey: ['post', postId],
 *   optimisticUpdate: (oldData) => ({
 *     ...oldData,
 *     likes: oldData.likes + 1,
 *     isLiked: true,
 *   }),
 * });
 */

export function useOptimisticMutation<TData = unknown, TVariables = unknown>({
  endpoint,
  method = 'POST',
  queryKey,
  optimisticUpdate,
  invalidateQueries,
  options,
}: {
  endpoint: string | ((variables: TVariables) => string);
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  queryKey: unknown[];
  optimisticUpdate: (oldData: TData, variables: TVariables) => TData;
  invalidateQueries?: unknown[][];
  options?: UseMutationOptions<TData, ApiError, TVariables, Context<TData>>;
}) {
  const queryClient = useQueryClient();

  return useMutation<TData, ApiError, TVariables, Context<TData>>({
    mutationFn: async (variables) => {
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

    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<TData>(queryKey);

      if (previousData) {
        queryClient.setQueryData<TData>(queryKey, (old) =>
          old ? optimisticUpdate(old, variables) : old,
        );
      }

      return { previousData };
    },

    onError: (error, variables, context, mutationContext) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      options?.onError?.(error, variables, context, mutationContext);
    },

    onSuccess: (data, variables, context, mutationContext) => {
      if (invalidateQueries) {
        invalidateQueries.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      }

      options?.onSuccess?.(data, variables, context, mutationContext);
    },

    onSettled: (data, error, variables, context, mutationContext) => {
      queryClient.invalidateQueries({ queryKey });

      options?.onSettled?.(data, error, variables, context, mutationContext);
    },

    ...options,
  });
}
