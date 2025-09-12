import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";
import watchlistReducer from "./slice/watchlistSlice";

const persistConfig = {
  key: "watchlist", 
  storage,
};

const persistedWatchlistReducer = persistReducer(persistConfig, watchlistReducer);

export const store = configureStore({
  reducer: {
    watchlist: persistedWatchlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

