import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, logoutUser } = authSlice.actions;

export default authSlice.reducer;
