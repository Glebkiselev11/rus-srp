import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "../models";

interface INotificationState {
  list: INotification[]
}

const initialState = { 
	list: [
		{ type: "success", text: "cool" }, 
		{ type: "error", text: "error" }
	] 
} as INotificationState;

const notificationSlice = createSlice({
	name: "counter",
	initialState,
	reducers: {
		add(state, action: PayloadAction<INotification>) {
			state.list.push(action.payload);

			setTimeout(() => {
				state.list.shift();
			}, 5000);
		},
	},
});

export const notificatonActions = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;