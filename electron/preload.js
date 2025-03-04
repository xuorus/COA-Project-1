const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    scan: () => ipcRenderer.send("scan"),
    minimize: () => ipcRenderer.send('minimize-window'),
    close: () => ipcRenderer.send('close-window'),
    send: (channel) => {
      const validChannels = ['minimize-window', 'close-window', 'scan'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel);
      }
    }
});