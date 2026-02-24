import {
  UseQueryOptions,
  UseMutationOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { ApiError } from '@/types/api';

export type QueryOptions<TData> = Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>;

export type MutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, ApiError, TVariables>,
  'mutationFn'
>;

export type InfiniteQueryOptions<TData> = Omit<
  UseInfiniteQueryOptions<TData, ApiError>,
  'queryKey' | 'queryFn'
>;
