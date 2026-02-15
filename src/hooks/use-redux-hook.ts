import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/rootReducer';
import type { AppDispatch } from '@/store/index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
