import { AuthState, User } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  sessionId: null,
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        sessionId?: string;
        accessToken?: string;
        user: User;
      }>
    ) => {
      if (action.payload.sessionId) {
        state.sessionId = action.payload.sessionId;
      }
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      state.user = action.payload.user;
    },
    clearAuth: () => initialState,
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;


