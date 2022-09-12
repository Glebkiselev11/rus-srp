import { configureStore } from "@reduxjs/toolkit";
import { notificationReducer } from "./notification";
import { wordsApi } from "./words";

const store = configureStore({
	reducer: {
		[wordsApi.reducerPath]:  wordsApi.reducer,
		notification: notificationReducer
	}
});

export type RootState = ReturnType<typeof store.getState>

export default store;