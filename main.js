const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const si = require('systeminformation')

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 750,
    title: 'SENTIByte - PC Health Monitor',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, 'dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Función para calcular la salud general del equipo (0 - 100)
function calculateHealthScore(cpuUsage, ramPercent, disks) {
  let score = 100

  // Penalizaciones por CPU alto
  if (cpuUsage > 85) score -= 25
  else if (cpuUsage > 70) score -= 10

  // Penalizaciones por RAM alta
  if (ramPercent > 90) score -= 25
  else if (ramPercent > 80) score -= 15

  // Penalización por disco casi lleno (< 10% libre)
  disks.forEach(disk => {
    if (disk.use > 90) score -= 20
    else if (disk.use > 80) score -= 10
  })

  return Math.max(0, Math.min(100, Math.round(score)))
}

ipcMain.handle('get-system-status', async () => {
  try {
    const cpuLoad = await si.currentLoad()
    const mem = await si.mem()
    const cpuTemp = await si.cpuTemperature()
    const fs = await si.fsSize()

    const cpuUsage = parseFloat(cpuLoad.currentLoad.toFixed(1))
    const ramPercent = parseFloat(((mem.active / mem.total) * 100).toFixed(1))

    const disks = fs.map(d => ({
      mount: d.mount || d.fs,
      sizeGB: (d.size / 1024 / 1024 / 1024).toFixed(1),
      usedGB: (d.used / 1024 / 1024 / 1024).toFixed(1),
      usePercent: d.use.toFixed(1)
    }))

    const healthScore = calculateHealthScore(cpuUsage, ramPercent, disks)

    return {
      healthScore,
      cpuUsage,
      cpuTemp: cpuTemp.main ? cpuTemp.main.toFixed(1) : '--',
      ramTotal: (mem.total / 1024 / 1024 / 1024).toFixed(1),
      ramUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
      ramPercent,
      disks
    }
  } catch (error) {
    console.error('Error leyendo métricas de hardware:', error)
    return {
      healthScore: 100,
      cpuUsage: 0,
      cpuTemp: '--',
      ramTotal: 0,
      ramUsed: 0,
      ramPercent: 0,
      disks: []
    }
  }
})