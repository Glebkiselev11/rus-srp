import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "sidemenu_state";

const initialState = {
  isOpen: JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "true"),
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
      localStorage.setItem(STORAGE_KEY, state.isOpen.toString());
    },
  },
});

export const { toggle } = sideMenuSlice.actions;

export const selectIsOpen = (state: { sideMenu: { isOpen: boolean } }) =>
  state.sideMenu.isOpen;

export const sideMenuReducer = sideMenuSlice.reducer;
