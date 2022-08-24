import { configureStore } from "@reduxjs/toolkit";
import { newWordApi } from "./NewWord/new-word.api";

export const store = configureStore({
	reducer: {
		[newWordApi.reducerPath]:  newWordApi.reducer
	}
});
