const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: false, // Start in full screen
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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
