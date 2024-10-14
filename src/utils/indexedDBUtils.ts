import { FileWithDirectoryAndFileHandle } from 'browser-fs-access';
import { set, get, del, update, setMany } from 'idb-keyval';

// Serializes files along with the handle to store them in IndexedDB
// Improved: Now we simply return the files as they contain all necessary fields, including the handle.
const serializeFiles = (files: FileWithDirectoryAndFileHandle[]): FileWithDirectoryAndFileHandle[] => {
  return files; // No need to map, the files already contain all the information.
};

// Save files in IndexedDB, including the handle
// Improved: We save the files with their handle as is without additional manipulation.
export const saveToIndexedDB = async (key: string, value: any, logCallback?: (type: 'log' | 'warn' | 'error', message: string) => void) => {
  try {
    const serializedValue = Array.isArray(value) && value[0]?.webkitRelativePath
      ? serializeFiles(value) // Files are serialized directly, no transformations needed.
      : value;

    await set(key, serializedValue); // Save the data in IndexedDB.
    if (logCallback) {
      logCallback('log', `Data saved in IndexedDB under the key: ${key}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (logCallback) {
      logCallback('error', `Error saving to IndexedDB (key: ${key}): ${errorMessage}`);
    }
  }
};

// Replace files in IndexedDB
// Improved: We create a copy of the files to ensure properties like "lastModified" are present before replacing them in IndexedDB.
export const replaceFilesInIndexedDB = async (key: string, newFiles: FileWithDirectoryAndFileHandle[], logCallback?: (type: 'log' | 'warn' | 'error', message: string) => void) => {
  try {
    // Create a copy of the files to ensure necessary properties are present
    var cloneFiles = newFiles.map(file => Object.assign({ lastModified: file.lastModified }, file));

    // Use 'update' to update the set of files in IndexedDB.
    await update(key, () => cloneFiles);

    // Create [key, value] pairs for each file for individual storage.
    var entries = cloneFiles.map(file => [file.webkitRelativePath, file]) as [IDBValidKey, any];
    await setMany(entries); // Save multiple files at once.

    if (logCallback) {
      logCallback('log', `Files replaced in IndexedDB under the key: ${key}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (logCallback) {
      logCallback('error', `Error replacing files in IndexedDB (key: ${key}): ${errorMessage}`);
    }
  }
};

// Load files from IndexedDB, including the handle to edit them
// Improved: We simply load the files from IndexedDB without unnecessary transformations.
export const loadFromIndexedDB = async (key: string, logCallback?: (type: 'log' | 'warn' | 'error', message: string) => void) => {
  try {
    const value = await get(key); // Retrieve the files from IndexedDB.
    return value; // Return the files as is.
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (logCallback) {
      logCallback('error', `Error loading from IndexedDB (key: ${key}): ${errorMessage}`);
    }
    return undefined;
  }
};

// Function to delete files from IndexedDB
// Improved: All files stored under the given key are deleted, with enhanced error handling and logging.
export const clearIndexedDB = async (key: string, logCallback?: (type: 'log' | 'warn' | 'error', message: string) => void) => {
  try {
    await del(key); // Deletes the 'files' key from IndexedDB.
    if (logCallback) {
      logCallback('log', `Files deleted from IndexedDB (key: ${key})`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (logCallback) {
      logCallback('error', `Error deleting files from IndexedDB (key: ${key}): ${errorMessage}`);
    }
  }
};
