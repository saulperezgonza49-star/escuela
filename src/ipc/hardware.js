const { ipcMain } = require('electron')
const { exec } = require('child_process')
const si = require('systeminformation')

// Lee la salud de batería directo de Windows via wmic
function getBatteryHealthWmic() {
  return new Promise((resolve) => {
    exec(
      'wmic path Win32_Battery get DesignCapacity,FullChargeCapacity /format:csv',
      (error, stdout) => {
        if (error || !stdout) return resolve(null)
        const lines = stdout.trim().split('\n').filter(l => l && !l.startsWith('Node'))
        if (!lines.length) return resolve(null)
        const parts   = lines[0].trim().split(',')
        const designed = parseInt(parts[1])
        const full     = parseInt(parts[2])
        if (!designed || !full || isNaN(designed) || isNaN(full)) return resolve(null)
        const pct = Math.round((full / designed) * 100)
        resolve(Math.min(100, Math.max(0, pct)))
      }
    )
  })
}

function register() {
  ipcMain.handle('get-advanced-hardware', async () => {
    try {
      const [battery, netStats, healthWmic] = await Promise.all([
        si.battery(),
        si.networkStats(),
        getBatteryHealthWmic()
      ])

      // acConnected es más fiable que isCharging en drivers HP
      const isCharging = battery.isCharging || battery.acConnected || false

      return {
        battery: {
          hasBattery:    battery.hasBattery,
          percent:       battery.percent || 0,
          isCharging,
          timeRemaining: battery.timeRemaining || 0,
          // Preferir wmic; si falla, caer a systeminformation
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
      console.error('[hardware] Error:', error)
      return {
        battery: { hasBattery: false, percent: 0, isCharging: false, health: null },
        network: { rx_sec: '0.00', tx_sec: '0.00' }
      }
    }
  })
}

module.exports = { register }