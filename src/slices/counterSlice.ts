import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store/store';
import { saveToIndexedDB, loadFromIndexedDB } from '../utils/indexedDBUtils';

// Slice to manage the counter state
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    reset: (state) => {
      state.value = 0; // Resets the counter value to 0
    },
    setCounter: (state, action) => {
      state.value = action.payload; // Sets the counter value to the provided payload
    },
  },
});

// Action to load the state from IndexedDB
export const loadCounterFromDB = () => async (dispatch: AppDispatch) => {
  const savedValue = await loadFromIndexedDB('counter'); // Loads the saved counter value from IndexedDB
  if (savedValue !== undefined) {
    dispatch(counterSlice.actions.setCounter(savedValue)); // Dispatches the action to set the counter value
  }
};

// Action to save the state in IndexedDB
export const saveCounterToDB = (value: number) => async () => {
  await saveToIndexedDB('counter', value); // Saves the counter value to IndexedDB
};

export const { reset, setCounter } = counterSlice.actions;
export default counterSlice.reducer;
