import { configureStore } from "@reduxjs/toolkit";
import { wordsApi } from "./words";

export const store = configureStore({
	reducer: {
		[wordsApi.reducerPath]:  wordsApi.reducer
	}
});
