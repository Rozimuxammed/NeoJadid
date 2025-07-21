import { createSlice } from "@reduxjs/toolkit";

const inputSlice = createSlice({
  name: "input",
  initialState: {
    value: "",
  },
  reducers: {
    setInputValue: (state, { payload }) => {
      state.value = payload;
    },
    clearInputValue: (state) => {
      state.value = "";
    },
  },
});

export const { setInputValue, clearInputValue } = inputSlice.actions;
export default inputSlice.reducer;
