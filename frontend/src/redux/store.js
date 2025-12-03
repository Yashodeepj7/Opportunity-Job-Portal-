// src/redux/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice";
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // optional: you can blacklist slices you never want to persist
  // blacklist: [] 
};

const appReducer = combineReducers({
  auth: authReducer,
  job: jobReducer,
  company: companySlice,
  application: applicationSlice
});

// Root reducer that resets state on logout
const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    // Option 1: purge persisted storage
    storage.removeItem('persist:root');
    // Option 2: return fresh state (all slices initialized)
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
export default store;
