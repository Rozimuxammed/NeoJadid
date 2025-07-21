import { configureStore } from "@reduxjs/toolkit";
import auth from "../redux/slices/auth-slice";
import inputValue from "../redux/slices/input-slice";
export const store = configureStore({
  reducer: { auth, inputValue },
});
