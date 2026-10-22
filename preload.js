const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getSystemStatus: () => ipcRenderer.invoke('get-system-status'),
  killProcess: (pid) => ipcRenderer.invoke('kill-process', pid),
  cleanTempFiles: () => ipcRenderer.invoke('clean-temp-files'),
  getAdvancedHardware: () => ipcRenderer.invoke('get-advanced-hardware'),
  getStartupApps: () => ipcRenderer.invoke('get-startup-apps'),
  getGpuMotherboard: () => ipcRenderer.invoke('get-gpu-motherboard'),
  flushRam: () => ipcRenderer.invoke('flush-ram'),
  exportReport: (data) => ipcRenderer.invoke('export-report', data)
})