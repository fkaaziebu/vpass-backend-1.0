import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  passwords: [],
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
  },
});

export const { userAuth, passwordListing } = authSlice.actions;

export default authSlice.reducer;
