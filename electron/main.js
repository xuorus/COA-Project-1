const { app, BrowserWindow } = require('electron');
const path = require('path');

async function createWindow() {
  const isDev = (await import('electron-is-dev')).default;

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the React app
  mainWindow.loadURL(
    isDev 
      ? 'http://localhost:5173' // Vite dev server URL
      : `file://${path.join(__dirname, '../frontend/dist/index.html')}`
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});