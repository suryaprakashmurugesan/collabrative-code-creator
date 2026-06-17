# Real-time Collaborative Code Editor

This project is a full-stack web application that provides a real-time, collaborative code editing environment, similar to the functionality found in tools like Google Docs or VS Code Live Share.

It demonstrates a mastery of modern web technologies, including real-time communication with WebSockets, advanced frontend state management with React, and a robust backend architecture with Node.js.

## Architecture

The application is split into two main parts:

1.  **Backend:** A Node.js server that uses `ws` (a WebSocket library) to manage client connections. It maintains the master copy of the document and is responsible for receiving changes from one client and broadcasting them to all other connected clients.
2.  **Frontend:** A React single-page application (SPA) built with Vite. It features a code editor and establishes a WebSocket connection to the backend. It sends user-generated changes to the server and applies incoming changes from other users to the local editor state.

Text synchronization is handled using Google's `diff-match-patch` library, which allows for efficient computation and application of text changes (patches).

## Project Structure

```
/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── styles.css
└── README.md
```

## How to Run This Project (Step-by-Step)

**Prerequisites:** You must have **[Node.js](https://nodejs.org/)** installed on your system to run this project, as it relies on the Node Package Manager (`npm`).

### Step 1: Set Up the Backend

First, you need to install the backend dependencies and start the server.

1.  **Open a new terminal.**
2.  **Navigate to the backend directory:**
    ```sh
    cd C:\Users\sumanth\Downloads\collaborative-code-editor\backend
    ```
3.  **Install the necessary packages:**
    ```sh
    npm install
    ```
4.  **Start the backend server:**
    ```sh
    npm start
    ```
    The server will start and you will see the message: `Server is running on http://localhost:8088 and WebSocket is on port 8089`. Keep this terminal open.

### Step 2: Set Up the Frontend

Next, you need to set up and run the React frontend in a separate terminal.

1.  **Open a second, new terminal.**
2.  **Navigate to the frontend directory:**
    ```sh
    cd C:\Users\sumanth\Downloads\collaborative-code-editor\frontend
    ```
3.  **Install the necessary packages:**
    ```sh
    npm install
    ```
4.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```
    The command will output a local URL, typically `http://localhost:5173`.

### Step 3: Use the Collaborative Editor

1.  **Open your web browser** (like Chrome or Firefox).
2.  **Navigate to the frontend URL** provided in the previous step (e.g., `http://localhost:5173`).
3.  **Open a second browser window or tab** and navigate to the same URL.
4.  Arrange the two windows side-by-side.
5.  Start typing in one window. You will see your changes appear in real-time in the other window!

You have now successfully set up and are running the Real-time Collaborative Code Editor.
