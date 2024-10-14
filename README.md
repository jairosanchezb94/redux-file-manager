# File Management App

## Description

This project is a File Management Application that allows users to upload, manage, and store files using IndexedDB. The application provides a user-friendly interface for selecting files from the local filesystem, displaying them in a list, and saving them for future access. Users can also modify and reset the stored files.

## Features

- Upload files from the local filesystem.
- Display a list of uploaded files.
- Select files for modification.
- Save and load files from IndexedDB.
- Reset the stored files in IndexedDB.
- User-friendly interface built with Material-UI.

## Libraries Used

- **React**: A JavaScript library for building user interfaces.
- **Redux Toolkit**: A library for managing application state with Redux.
- **Material-UI**: A popular React UI framework that provides pre-designed components for faster development.
- **browser-fs-access**: A library that allows access to the filesystem in a browser environment.
- **idb-keyval**: A simple library for using IndexedDB with a key-value store interface.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/file-management-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd file-management-app
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- Click the "Upload" button to select files from your local filesystem.
- The uploaded files will be displayed in a list.
- You can select files to modify them.
- Use the "Save" button to store the files in IndexedDB.
- The "Reset" button will clear all stored files.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
