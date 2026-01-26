import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from '../features/auth/authSlice'
import documentReducer from '../features/documents/documentSlice'
import chatReducer from '../features/chat/chatSlice'
import uiReducer from '../features/ui/uiSlice'

// Persist configuration for UI (theme only)
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme'] // Only persist theme
}

// Persist configuration for auth (token only)
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'] // Only persist token
}

const persistedUiReducer = persistReducer(uiPersistConfig, uiReducer)
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    documents: documentReducer,
    chat: chatReducer,
    ui: persistedUiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
})

export const persistor = persistStore(store)