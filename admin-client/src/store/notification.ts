import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "../models";

interface INotificationState {
  list: INotification[];
}

const initialState = { list: [] } as INotificationState;

const notificationSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    add(state, action: PayloadAction<INotification>) {
      state.list.push({ ...action.payload, id: new Date().toString() });
    },
    shift(state) {
      state.list.shift();
    },
  },
});

export const notificatonActions = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
