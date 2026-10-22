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
    win.loadURL('http://localhost:5174')
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

// ─── CACHÉ de datos que NO cambian cada 2s ────────────────────────────────────
let cachedSystemInfo = null        // fabricante/modelo: se lee una sola vez
let cachedDisks = null             // discos: se actualiza cada 30s
let cachedProcesses = null         // procesos: se actualiza cada 5s
let lastDiskUpdate = 0
let lastProcessUpdate = 0

const DISK_INTERVAL    = 30_000  // ms
const PROCESS_INTERVAL =  5_000  // ms

// Pre-calentar currentLoad
si.currentLoad().catch(() => {})

// ─── Score de salud ────────────────────────────────────────────────────────────
function calculateHealthScore(cpuUsage, ramPercent, disks) {
  let score = 100
  if (cpuUsage > 85)      score -= 25
  else if (cpuUsage > 70) score -= 10

  if (ramPercent > 90)    score -= 25
  else if (ramPercent > 80) score -= 15

  disks.forEach(disk => {
    if (disk.usePercent > 90)      score -= 20
    else if (disk.usePercent > 80) score -= 10
  })

  return Math.max(0, Math.min(100, Math.round(score)))
}

// ─── Handler principal ─────────────────────────────────────────────────────────
ipcMain.handle('get-system-status', async () => {
  try {
    const now = Date.now()

    const cpuLoadPromise = si.currentLoad()
    const memPromise     = si.mem()
    const cpuTempPromise = si.cpuTemperature()

    if (!cachedSystemInfo) {
      cachedSystemInfo = await si.system()
    }

    if (!cachedDisks || now - lastDiskUpdate > DISK_INTERVAL) {
      const fsSize = await si.fsSize()
      cachedDisks = fsSize.map(d => ({
        mount:      d.mount || d.fs,
        sizeGB:    (d.size / 1024 / 1024 / 1024).toFixed(1),
        usedGB:    (d.used / 1024 / 1024 / 1024).toFixed(1),
        usePercent: parseFloat(d.use).toFixed(1)
      }))
      lastDiskUpdate = now
    }

    if (!cachedProcesses || now - lastProcessUpdate > PROCESS_INTERVAL) {
      const processes = await si.processes()
      const list = (processes && processes.list) ? processes.list : []
      const valid = list.filter(p =>
        p.name &&
        p.name.toLowerCase() !== 'system idle process' &&
        p.name.toLowerCase() !== 'system' &&
        p.pid !== 0 &&
        p.pid !== 4
      )
      const sorted = [...valid].sort((a, b) => b.cpu - a.cpu)
      cachedProcesses = {
        topProcess: sorted[0]
          ? { name: sorted[0].name, pid: sorted[0].pid, cpu: sorted[0].cpu.toFixed(1) }
          : null,
        processesList: sorted.slice(0, 10).map(p => ({
          pid:  p.pid  || 0,
          name: p.name || 'Proceso',
          cpu:  p.cpu  ? p.cpu.toFixed(1) : '0.0',
          mem:  p.mem  ? p.mem.toFixed(1) : '0.0'
        }))
      }
      lastProcessUpdate = now
    }

    const [cpuLoad, mem, cpuTemp] = await Promise.all([
      cpuLoadPromise,
      memPromise,
      cpuTempPromise
    ])

    const cpuUsage   = parseFloat(cpuLoad.currentLoad.toFixed(1))
    const ramPercent = parseFloat(((mem.active / mem.total) * 100).toFixed(1))
    const healthScore = calculateHealthScore(cpuUsage, ramPercent, cachedDisks)

    return {
      healthScore,
      manufacturer:  cachedSystemInfo.manufacturer || 'Fabricante',
      model:         cachedSystemInfo.model || 'Equipo Windows',
      cpuUsage,
      cpuTemp:       cpuTemp.main ? cpuTemp.main.toFixed(1) : '--',
      ramTotal:      (mem.total  / 1024 / 1024 / 1024).toFixed(1),
      ramUsed:       (mem.active / 1024 / 1024 / 1024).toFixed(1),
      ramPercent,
      disks:         cachedDisks,
      topProcess:    cachedProcesses.topProcess,
      processesList: cachedProcesses.processesList
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

// Lee la salud real de batería directo de Windows (más preciso que systeminformation)
function getBatteryHealthWmic() {
  return new Promise((resolve) => {
    exec(
      'wmic path Win32_Battery get DesignCapacity,FullChargeCapacity /format:csv',
      (error, stdout) => {
        if (error || !stdout) return resolve(null)
        const lines = stdout.trim().split('\n').filter(l => l && !l.startsWith('Node'))
        if (!lines.length) return resolve(null)
        const parts = lines[0].trim().split(',')
        const designed = parseInt(parts[1])
        const full     = parseInt(parts[2])
        if (!designed || !full || isNaN(designed) || isNaN(full)) return resolve(null)
        const pct = Math.round((full / designed) * 100)
        resolve(Math.min(100, Math.max(0, pct)))
      }
    )
  })
}

// IPC Handler para obtener detalles de la batería y red
ipcMain.handle('get-advanced-hardware', async () => {
  try {
    const [battery, netStats, healthWmic] = await Promise.all([
      si.battery(),
      si.networkStats(),
      getBatteryHealthWmic()
    ])

    const isCharging = battery.isCharging || battery.acConnected || false

    return {
      battery: {
        hasBattery:    battery.hasBattery,
        percent:       battery.percent || 0,
        isCharging,
        timeRemaining: battery.timeRemaining || 0,
        health: healthWmic !== null ? healthWmic : (() => {
          const max  = battery.maxCapacity      || 0
          const orig = battery.designedCapacity || 0
          if (!max || !orig) return null
          return Math.min(100, Math.max(0, Math.round((max / orig) * 100)))
        })()
      },
      network: netStats[0] ? {
        rx_sec: (netStats[0].rx_sec / 1024 / 1024).toFixed(2),
        tx_sec: (netStats[0].tx_sec / 1024 / 1024).toFixed(2)
      } : { rx_sec: '0.00', tx_sec: '0.00' }
    }
  } catch (error) {
    console.error('Error leyendo hardware avanzado:', error)
    return {
      battery: { hasBattery: false, percent: 0, isCharging: false, health: null },
      network: { rx_sec: '0.00', tx_sec: '0.00' }
    }
  }
})

// IPC Handler para cerrar un proceso por PID
ipcMain.handle('kill-process', async (event, pid) => {
  cachedProcesses = null
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
    cachedDisks = null
    return { success: true, freedMB, deletedFilesCount }
  } catch (error) {
    return { success: false, message: 'Error al acceder a la carpeta de temporales.' }
  }
})

// ─── 1. Gestor de Aplicaciones de Inicio (Startup) ─────────────────────────────
ipcMain.handle('get-startup-apps', async () => {
  try {
    const psCommand = 'powershell "Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location | ConvertTo-Json"'
    const { execSync } = require('child_process')
    const output = execSync(psCommand, { encoding: 'utf8', timeout: 3000 }).trim()
    if (!output) return []
    const parsed = JSON.parse(output)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (error) {
    return []
  }
})

// ─── 2. Detalles Avanzados de GPU y Tarjeta Madre ──────────────────────────────
ipcMain.handle('get-gpu-motherboard', async () => {
  try {
    const graphics = await si.graphics()
    const baseboard = await si.baseboard()
    const bios = await si.bios()

    const gpuName = graphics.controllers[0] ? graphics.controllers[0].model : 'Gráficos Integrados / Genéricos'
    const vram = graphics.controllers[0] && graphics.controllers[0].vram ? graphics.controllers[0].vram + ' MB' : 'Compartida'

    return {
      gpu: gpuName,
      vram: vram,
      motherboard: `${baseboard.manufacturer || 'HP'} ${baseboard.model || 'ProBook'}`,
      biosVersion: bios.version || 'UEFI'
    }
  } catch (error) {
    return { gpu: 'No detectada', vram: '--', motherboard: 'Placa Base', biosVersion: '--' }
  }
})

// ─── 3. Liberador Rápido de RAM ────────────────────────────────────────────────
ipcMain.handle('flush-ram', async () => {
  try {
    const psCommand = 'powershell "Get-Process | Where-Object {$_.WorkingSet -gt 20000000} | ForEach-Object { $_.MinWorkingSet = [IntPtr]} -ErrorAction SilentlyContinue"'
    const { execSync } = require('child_process')
    execSync(psCommand, { timeout: 3000 })
    return { success: true, message: 'Memoria RAM optimizada y liberada con éxito.' }
  } catch (error) {
    return { success: false, message: 'No se pudo forzar la liberación completa de RAM.' }
  }
})

// ─── 4. Exportador de Reportes de Diagnóstico (FALTABA ESTE) ────────────────────
ipcMain.handle('export-report', async (event, reportData) => {
  try {
    const desktopPath = path.join(os.homedir(), 'Desktop')
    const fileName = `Reporte_Diagnostico_SENTIByte_${Date.now()}.json`
    const filePath = path.join(desktopPath, fileName)

    fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2), 'utf8')
    return { success: true, path: filePath }
  } catch (error) {
    return { success: false, message: 'Error al exportar el reporte en el Escritorio.' }
  }
})