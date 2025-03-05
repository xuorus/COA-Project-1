const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: false, // Add this to use custom window controls
    fullscreen: true,
    backgroundColor: 'transparent',
    transparent: true,
    webPreferences: {
      nodeIntegration: true, // Change to true for security
      contextIsolation: true, // Change to true for security
      preload: path.join(__dirname, 'preload.js') // Make sure preload path is correct
    }
  });

  const isDev = !app.isPackaged;
  const devURL = 'http://localhost:5173';
  const prodURL = `file://${path.join(__dirname, '../frontend/dist/index.html')}`;

  if (isDev) {
    await loadDevURL(mainWindow, devURL);
  } else {
    mainWindow.loadURL(prodURL).catch(err => {
      console.error('Failed to load production build:', err);
    });
  }
}

async function loadDevURL(window, url, retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await window.loadURL(url);
      console.log('Loaded dev server successfully.');
      return;
    } catch (err) {
      console.warn(`Retry ${i + 1}/${retries}: Failed to load ${url}. Retrying in ${delay / 1000}s...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  console.error('Failed to load dev server. Please ensure Vite is running.');
}

ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

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
