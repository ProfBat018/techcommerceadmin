import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../types/UserInfo";

interface UserState {
  user: UserInfo | null;
  isLoading: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo | null>) => {
      state.user = action.payload;
      state.isLoading = false; // Когда данные загружены, убираем состояние загрузки
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
