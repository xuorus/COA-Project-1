const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { pathToFileURL } = require('url');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load React App
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); // Vite dev server
  } else {
    const indexPath = pathToFileURL(path.join(__dirname, '../frontend/dist/index.html')).href;
    mainWindow.loadURL(indexPath);
  }

  // Open DevTools in Development Mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Ensure the app is ready before creating the window
app.whenReady().then(() => {
  createWindow();
  
  // macOS-specific behavior: Reopen the window when clicking the app icon
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Close the app when all windows are closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Error Handling
process.on('uncaughtException', (err) => {
  console.error('Unhandled Error:', err);
});
