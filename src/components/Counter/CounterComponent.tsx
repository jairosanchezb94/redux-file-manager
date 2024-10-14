import { useState, useEffect } from "react";
import {
  directoryOpen,
  fileSave,
  FileWithDirectoryAndFileHandle,
} from "browser-fs-access";
import {
  Button,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Checkbox,
} from "@mui/material";
import {
  saveToIndexedDB,
  loadFromIndexedDB,
  replaceFilesInIndexedDB,
  clearIndexedDB,
} from "../../utils/indexedDBUtils";
import AlertLogger from "../AlertLogger/AlertLogger";

const CounterComponent = () => {
  const [files, setFilesState] = useState<FileWithDirectoryAndFileHandle[]>([]); // Stores the loaded files.
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set()); // Selected files.
  const [logs, setLogs] = useState<{ type: "log" | "warn" | "error"; message: string }[]>([]); // State to manage logs.

  // Improved function to load files from IndexedDB.
  const mayLoadFilesFromStore = async () => {
    const storedFiles = await loadFromIndexedDB("files", addLog); // Load from IndexedDB with logging.

    if (storedFiles) {
      setFilesState(storedFiles); // Sets the files in the component's state.
      addLog("log", "Files have been loaded from IndexedDB...");
    }
  };

  // Initial load: retrieves files from IndexedDB
  useEffect(() => {
    mayLoadFilesFromStore(); // Load files when the component mounts.
  }, []);

  // Function to add log messages.
  const addLog = (type: "log" | "warn" | "error", message: string) => {
    setLogs((prevLogs) => [...prevLogs, { type, message }]);
    // Auto-remove the log after 10 seconds.
    setTimeout(() => {
      setLogs((prevLogs) => prevLogs.slice(1));
    }, 10000);
  };

  // Upload a new folder and replace existing files in IndexedDB.
  const handleFileUpload = async () => {
    try {
      const openFiles = (await directoryOpen({
        recursive: true,
        mode: "readwrite",
      })) as FileWithDirectoryAndFileHandle[]; // Casting for the opened files.
      setFilesState(openFiles); // Updates the state with the new files.
      setSelectedFiles(new Set()); // Clears the selected files.
      await replaceFilesInIndexedDB("files", openFiles, addLog); // Replaces files in IndexedDB with logs.
    } catch (error) {
      addLog("error", `Error uploading files: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Manually save files to IndexedDB.
  const handleSaveToIndexedDB = async () => {
    try {
      await saveToIndexedDB("files", files, addLog); // Manually saves files to IndexedDB.
    } catch (error) {
      addLog("error", `Error saving files manually to IndexedDB: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Reset files: removes files from IndexedDB and clears the file list.
  const handleResetFiles = async () => {
    try {
      await clearIndexedDB("files", addLog); // Remove files from IndexedDB.
      setFilesState([]); // Clear the file list in the state.
      addLog("log", "Existing files have been deleted from IndexedDB");
    } catch (error) {
      addLog("error", `Error resetting files: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Handle file selection.
  const handleSelectFile = (filePath: string) => {
    setSelectedFiles((prevSelectedFiles) => {
      const newSelectedFiles = new Set(prevSelectedFiles); // Create a new set of selected files.
      if (newSelectedFiles.has(filePath)) {
        newSelectedFiles.delete(filePath); // Deselect the file if it is already selected.
      } else {
        newSelectedFiles.add(filePath); // Select the file.
      }
      return newSelectedFiles;
    });
  };

  // Handle file modification.
  const handleModifyFiles = async () => {
    if (selectedFiles.size === 0) {
      return; // Do nothing if no files are selected.
    }
    const selectedFilePaths = Array.from(selectedFiles);
    await modifySelectedFiles(selectedFilePaths, files);
    await replaceFilesInIndexedDB("files", files, addLog);
  };

  // Modify selected files.
  const modifySelectedFiles = async (selectedFilePaths: string[], files: FileWithDirectoryAndFileHandle[]) => {
    const filesToModify = files.filter((file) =>
      selectedFilePaths.includes(file.webkitRelativePath)
    );

    for (const file of filesToModify) {
      if (file.handle) {
        const blob = new Blob(["Modified content " + new Date()]);
        fileSave(blob, {}, file.handle);
        addLog("log", `File modified: ${file.webkitRelativePath}`);
      } else {
        addLog("warn", `The file ${file.name} does not have an associated handle.`);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
        File Management
      </Typography>
      <Paper elevation={1} sx={{ padding: 2, borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleFileUpload} sx={{ flex: 1, mx: 1 }}>
            Upload
          </Button>
          <Button variant="contained" color="success" onClick={handleSaveToIndexedDB} sx={{ flex: 1, mx: 1 }}>
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleModifyFiles}
            sx={{ flex: 1, mx: 1 }}
            disabled={selectedFiles.size === 0}
          >
            Modify
          </Button>
          <Button variant="contained" color="error" onClick={handleResetFiles} sx={{ flex: 1, mx: 1 }}>
            Reset
          </Button>
        </Box>
        <Box mt={2}>
          <Typography variant="h6" sx={{ mb: 1 }}>Files:</Typography>
          {files.length > 0 ? (
            <List sx={{ padding: 0 }}>
              {files.map((file) => (
                <ListItem key={file.webkitRelativePath} sx={{ paddingLeft: 0 }}>
                  <Checkbox
                    checked={selectedFiles.has(file.webkitRelativePath)}
                    onChange={() => handleSelectFile(file.webkitRelativePath)}
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: selectedFiles.has(file.webkitRelativePath) ? 'bold' : 'normal',
                      color: selectedFiles.has(file.webkitRelativePath) ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {file.webkitRelativePath || file.name}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="textSecondary" sx={{ fontStyle: 'italic' }}>
              No files uploaded or existing files have been deleted from IndexedDB.
            </Typography>
          )}
        </Box>
      </Paper>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "300px",
          zIndex: 1000,
        }}
      >
        {logs.map((log, index) => (
          <AlertLogger key={index} type={log.type} message={log.message} />
        ))}
      </Box>
    </Box>
  );
};

export default CounterComponent;
