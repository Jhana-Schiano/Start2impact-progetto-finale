import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type ToastKind = "success" | "error" | "info";

export type ShowToastInput = {
  message: string;
  kind?: ToastKind;
  durationMs?: number;
};

export type ToastItem = {
  id: number;
  message: string;
  kind: ToastKind;
  durationMs: number;
};

type ToastState = {
  items: ToastItem[];
};

const DEFAULT_DURATION_MS = 3200;

const initialState: ToastState = {
  items: [],
};

let toastCounter = 0;

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: {
      reducer: (state, action: PayloadAction<ToastItem>) => {
        state.items.push(action.payload);
      },
      prepare: ({
        message,
        kind = "info",
        durationMs = DEFAULT_DURATION_MS,
      }: ShowToastInput) => ({
        payload: {
          id: ++toastCounter,
          message,
          kind,
          durationMs,
        },
      }),
    },
    dismissToast: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { showToast, dismissToast } = toastSlice.actions;

export const selectToasts = (state: RootState) => state.toast.items;

export default toastSlice.reducer;
