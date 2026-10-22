const { ipcMain } = require('electron')
const si = require('systeminformation')

let cachedSystemInfo = null
let cachedDisks = null
let cachedProcesses = null
let lastDiskUpdate = 0
let lastProcessUpdate = 0

const DISK_INTERVAL = 30_000
const PROCESS_INTERVAL = 5_000

si.currentLoad().catch(() => {})

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
    const now = Date.now()

    const cpuLoadPromise = si.currentLoad()
    const memPromise = si.mem()
    const cpuTempPromise = si.cpuTemperature()

    if (!cachedSystemInfo) {
      cachedSystemInfo = await si.system()
    }

    if (!cachedDisks || now - lastDiskUpdate > DISK_INTERVAL) {
      const fsSize = await si.fsSize()
      cachedDisks = fsSize.map(d => ({
        mount: d.mount || d.fs,
        sizeGB: (d.size / 1024 / 1024 / 1024).toFixed(1),
        usedGB: (d.used / 1024 / 1024 / 1024).toFixed(1),
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
          pid: p.pid || 0,
          name: p.name || 'Proceso',
          cpu: p.cpu ? p.cpu.toFixed(1) : '0.0',
          mem: p.mem ? p.mem.toFixed(1) : '0.0'
        }))
      }
      lastProcessUpdate = now
    }

    const [cpuLoad, mem, cpuTemp] = await Promise.all([
      cpuLoadPromise,
      memPromise,
      cpuTempPromise
    ])

    const cpuUsage = parseFloat(cpuLoad.currentLoad.toFixed(1))
    const ramPercent = parseFloat(((mem.active / mem.total) * 100).toFixed(1))
    const healthScore = calculateHealthScore(cpuUsage, ramPercent, cachedDisks)

    return {
      healthScore,
      manufacturer: cachedSystemInfo.manufacturer || 'Fabricante',
      model: cachedSystemInfo.model || 'Equipo Windows',
      cpuUsage,
      cpuTemp: cpuTemp.main ? cpuTemp.main.toFixed(1) : '--',
      ramTotal: (mem.total / 1024 / 1024 / 1024).toFixed(1),
      ramUsed: (mem.active / 1024 / 1024 / 1024).toFixed(1),
      ramPercent,
      disks: cachedDisks,
      topProcess: cachedProcesses.topProcess,
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