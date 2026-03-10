import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type User = {
  id: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  showPassword: boolean;
  rememberMe: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  showPassword: false,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setShowPassword(state, action: PayloadAction<boolean>) {
      state.showPassword = action.payload;
    },
    setRememberMe(state, action: PayloadAction<boolean>) {
      state.rememberMe = action.payload;
    },
  },
});

export const { setUser, clearUser, setShowPassword, setRememberMe } = authSlice.actions;
export default authSlice.reducer;
