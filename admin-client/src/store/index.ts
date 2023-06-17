import { configureStore } from "@reduxjs/toolkit";
import { notificationReducer } from "./notification";
import { wordsApi } from "./words";
import { translateApi } from "./translate";
import { sideMenuReducer } from "./sideMenu";

const store = configureStore({
  reducer: {
    [wordsApi.reducerPath]: wordsApi.reducer,
    [translateApi.reducerPath]: translateApi.reducer,
    notification: notificationReducer,
    sideMenu: sideMenuReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(wordsApi.middleware)
      .concat(translateApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
