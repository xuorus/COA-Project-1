const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    scan: () => ipcRenderer.send("scan"),
});