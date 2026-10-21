const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getSystemStatus: () => ipcRenderer.invoke('get-system-status'),
  killProcess: (pid) => ipcRenderer.invoke('kill-process', pid),
  cleanTempFiles: () => ipcRenderer.invoke('clean-temp-files'),
  getAdvancedHardware: () => ipcRenderer.invoke('get-advanced-hardware')
})