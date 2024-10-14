import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { saveToIndexedDB, loadFromIndexedDB } from '../utils/indexedDBUtils';

interface UserState {
  files: string[];
  fileHandle: any; // Any type for fileHandle
}

// Initial state
const initialState: UserState = {
  files: [],
  fileHandle: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reducer to set the files
    setFiles(state, action: PayloadAction<string[]>) {
      state.files = action.payload; // Sets the files to the provided payload
    },
    // Reducer to set the fileHandle
    setFileHandle(state, action: PayloadAction<any>) {
      state.fileHandle = action.payload; // Sets the fileHandle to the provided payload
    },
  },
});

// Action to load the files from IndexedDB
export const loadFilesFromDB = () => async (dispatch: any) => {
  const savedFiles = await loadFromIndexedDB('files'); // Loads saved files from IndexedDB
  if (savedFiles) {
    dispatch(userSlice.actions.setFiles(savedFiles)); // Dispatches the action to set the files
  }
};

// Action to save the files in IndexedDB
export const saveFilesToDB = (files: string[]) => async () => {
  await saveToIndexedDB('files', files); // Saves the files to IndexedDB
};

// Action to load the fileHandle from IndexedDB
export const loadFileHandleFromDB = () => async (dispatch: any) => {
  const savedFileHandle = await loadFromIndexedDB('fileHandle'); // Loads saved fileHandle from IndexedDB
  if (savedFileHandle) {
    dispatch(userSlice.actions.setFileHandle(savedFileHandle)); // Dispatches the action to set the fileHandle
  }
};

// Action to save the fileHandle in IndexedDB
export const saveFileHandleToDB = (fileHandle: any) => async () => {
  await saveToIndexedDB('fileHandle', fileHandle); // Saves the fileHandle to IndexedDB
};

export const { setFiles, setFileHandle } = userSlice.actions;
export default userSlice.reducer;
