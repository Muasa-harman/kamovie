import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import watchlistReducer from "./slice/watchlistSlice";
import storage from "./persistConfig";
import authReducer from "./slice/authSlice"

const watchlistPersistConfig = {
  key: "watchlist", 
  storage,
};

const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedWatchlistReducer = persistReducer(watchlistPersistConfig, watchlistReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    watchlist: persistedWatchlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

