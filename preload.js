const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getSystemStatus: () => ipcRenderer.invoke('get-system-status')
})