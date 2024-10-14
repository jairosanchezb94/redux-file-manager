import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterReducer from '../slices/counterSlice';
import userReducer from '../slices/userSlice';

// Configures the store
const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false, // Disables the serialization check
});

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer, // Adds the user slice that manages uploaded files and fileHandle
  },
  middleware: customizedMiddleware,
});

// Exports RootState for use in useSelector
export type RootState = ReturnType<typeof store.getState>;

// Types for dispatch
export type AppDispatch = typeof store.dispatch;

export default store;
