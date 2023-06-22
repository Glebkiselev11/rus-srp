import { configureStore } from "@reduxjs/toolkit";
import { notificationReducer } from "./notification";
import { wordsApi } from "./words";
import { translationApi } from "./translation";
import { sideMenuReducer } from "./sideMenu";

const store = configureStore({
  reducer: {
    [wordsApi.reducerPath]: wordsApi.reducer,
    [translationApi.reducerPath]: translationApi.reducer,
    notification: notificationReducer,
    sideMenu: sideMenuReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(wordsApi.middleware)
      .concat(translationApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
