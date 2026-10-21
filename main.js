const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const os = require('os')
const { exec } = require('child_process')
const si = require('systeminformation')

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1050,
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

function calculateHealthScore(cpuUsage, ramPercent, disks) {
  let score = 100
  if (cpuUsage > 85) score -= 25
  else if (cpuUsage > 70) score -= 10

  if (ramPercent > 90) score -= 25
  else if (ramPercent > 80) score -= 15

  disks.forEach(disk => {
    if (disk.usePercent > 90) score -= 20
    else if (disk.usePercent > 80) score -= 10
  })

  return Math.max(0, Math.min(100, Math.round(score)))
}

ipcMain.handle('get-system-status', async () => {
  try {
    const cpuLoad = await si.currentLoad()
    const mem = await si.mem()
    const cpuTemp = await si.cpuTemperature()
    const fsSize = await si.fsSize()
    const systemInfo = await si.system()
    const processes = await si.processes()

    // Usar la carga nativa optimizada (sin llamadas lentas a PowerShell que causan tirones)
    const cpuUsage = parseFloat(cpuLoad.currentLoad.toFixed(1))
    const ramPercent = parseFloat(((mem.active / mem.total) * 100).toFixed(1))

    // Filtrar procesos inactivos o del kernel de Windows
    const list = (processes && processes.list) ? processes.list : []
    const validProcesses = list.filter(p => 
      p.name && 
      p.name.toLowerCase() !== 'system idle process' && 
      p.name.toLowerCase() !== 'system' &&
      p.pid !== 0 && 
      p.pid !== 4
    )

    // Ordenar de mayor a menor consumo de CPU
    const sortedCpu = [...validProcesses].sort((a, b) => b.cpu - a.cpu)

    const topProcess = sortedCpu[0] ? { name: sortedCpu[0].name, pid: sortedCpu[0].pid, cpu: sortedCpu[0].cpu.toFixed(1) } : null

    // Tomar los 10 procesos principales reales
    const processesList = sortedCpu.slice(0, 10).map(p => ({
      pid: p.pid || 0,
      name: p.name || 'Proceso',
      cpu: p.cpu ? p.cpu.toFixed(1) : '0.0',
      mem: p.mem ? p.mem.toFixed(1) : '0.0'
    }))

    const disks = fsSize.map(d => ({
      mount: d.mount || d.fs,
      sizeGB: (d.size / 1024 / 1024 / 1024).toFixed(1),
      usedGB: (d.used / 1024 / 1024 / 1024).toFixed(1),
      usePercent: parseFloat(d.use).toFixed(1)
    }))

    const healthScore = calculateHealthScore(cpuUsage, ramPercent, disks)

    return {
      healthScore,
      manufacturer: systemInfo.manufacturer || 'Fabricante',
      model: systemInfo.model || 'Equipo Windows',
      cpuUsage,
      cpuTemp: cpuTemp.main ? cpuTemp.main.toFixed(1) : '--',
      ramTotal: (mem.total / 1024 / 1024 / 1024).toFixed(1),
      ramUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
      ramPercent,
      disks,
      topProcess,
      processesList
    }
  } catch (error) {
    console.error('Error leyendo métricas:', error)
    return {
      healthScore: 100,
      manufacturer: 'PC',
      model: 'Windows',
      cpuUsage: 0,
      cpuTemp: '--',
      ramTotal: 0,
      ramUsed: 0,
      ramPercent: 0,
      disks: [],
      topProcess: null,
      processesList: []
    }
  }
})

// IPC Handler para cerrar un proceso por PID
ipcMain.handle('kill-process', async (event, pid) => {
  return new Promise((resolve) => {
    exec(`taskkill /F /PID ${pid}`, (error) => {
      if (error) {
        resolve({ success: false, message: 'No se pudo finalizar el proceso o requiere mayores privilegios.' })
      } else {
        resolve({ success: true, message: `Proceso ${pid} finalizado correctamente.` })
      }
    })
  })
})

// IPC Handler para limpiar archivos temporales (%TEMP%)
ipcMain.handle('clean-temp-files', async () => {
  const tempDir = os.tmpdir()
  let freedBytes = 0
  let deletedFilesCount = 0

  try {
    const files = fs.readdirSync(tempDir)
    for (const file of files) {
      const filePath = path.join(tempDir, file)
      try {
        const stats = fs.statSync(filePath)
        if (stats.isFile()) {
          freedBytes += stats.size
          fs.unlinkSync(filePath)
          deletedFilesCount++
        }
      } catch (e) {
        // Ignorar archivos actualmente en uso por Windows
      }
    }
    const freedMB = (freedBytes / 1024 / 1024).toFixed(2)
    return { success: true, freedMB, deletedFilesCount }
  } catch (error) {
    return { success: false, message: 'Error al acceder a la carpeta de temporales.' }
  }
})