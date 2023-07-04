import { configureStore } from "@reduxjs/toolkit";
import { notificationReducer } from "./notification";
import { wordsApi } from "./words";
import { translationApi } from "./translation";
import { imagesApi } from "./images";

const store = configureStore({
  reducer: {
    [wordsApi.reducerPath]: wordsApi.reducer,
    [translationApi.reducerPath]: translationApi.reducer,
    [imagesApi.reducerPath]: imagesApi.reducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(wordsApi.middleware)
      .concat(translationApi.middleware)
      .concat(imagesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
