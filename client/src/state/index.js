import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  passwords: [],
  errorMessage: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userAuth: (state, action) => {
      state.user = { ...action.payload };
    },
    passwordListing: (state, action) => {
      state.passwords = [...action.payload];
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = { ...action.payload };
    },
  },
});

export const { userAuth, passwordListing, setErrorMessage } = authSlice.actions;

export default authSlice.reducer;
