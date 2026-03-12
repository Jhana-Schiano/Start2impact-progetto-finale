import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUtente } from "../api/utenti";
import type { RootState } from "./store";

type LoginCredentials = {
  email: string;
  password: string;
};

type AuthState = {
  userId: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  userId: null,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  number,
  LoginCredentials,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUtente(credentials);
    return response.id;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Errore durante il login",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.userId = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Errore durante il login";
      });
  },
});

export const { logout } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUserId = (state: RootState) => state.auth.userId;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.userId !== null;

export default authSlice.reducer;
