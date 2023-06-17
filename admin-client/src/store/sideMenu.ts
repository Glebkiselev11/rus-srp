import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggle } = sideMenuSlice.actions;

export const selectIsOpen = (state: { sideMenu: { isOpen: boolean } }) =>
  state.sideMenu.isOpen;

export const sideMenuReducer = sideMenuSlice.reducer;
