const { ipcMain } = require('electron')
const { exec, execSync } = require('child_process')
const fs   = require('fs')
const os   = require('os')
const path = require('path')
const si   = require('systeminformation')

function register() {

  // ─── Aplicaciones de inicio (Startup) ──────────────────────────────────────
  ipcMain.handle('get-startup-apps', async () => {
    try {
      const psCommand = 'powershell "Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location | ConvertTo-Json"'
      const output = execSync(psCommand, { encoding: 'utf8', timeout: 5000 }).trim()
      if (!output) return []
      const parsed = JSON.parse(output)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch (error) {
      console.error('[tools] get-startup-apps:', error)
      return []
    }
  })

  // ─── GPU y Placa Base ───────────────────────────────────────────────────────
  ipcMain.handle('get-gpu-motherboard', async () => {
    try {
      const [graphics, baseboard, bios] = await Promise.all([
        si.graphics(),
        si.baseboard(),
        si.bios()
      ])

      const gpuName = graphics.controllers[0]
        ? graphics.controllers[0].model
        : 'Gráficos Integrados / Genéricos'
      const vram = graphics.controllers[0] && graphics.controllers[0].vram
        ? graphics.controllers[0].vram + ' MB'
        : 'Compartida'

      return {
        gpu:          gpuName,
        vram,
        motherboard:  `${baseboard.manufacturer || 'HP'} ${baseboard.model || 'ProBook'}`,
        biosVersion:  bios.version || 'UEFI'
      }
    } catch (error) {
      console.error('[tools] get-gpu-motherboard:', error)
      return { gpu: 'No detectada', vram: '--', motherboard: 'Placa Base', biosVersion: '--' }
    }
  })

  // ─── Liberador rápido de RAM ────────────────────────────────────────────────
  ipcMain.handle('flush-ram', async () => {
    try {
      execSync(
        'powershell "[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers(); [System.GC]::Collect()"',
        { timeout: 5000 }
      )
      return { success: true, message: 'Memoria RAM optimizada y liberada con éxito.' }
    } catch (error) {
      console.error('[tools] flush-ram:', error)
      return { success: false, message: 'No se pudo forzar la liberación completa de RAM.' }
    }
  })

  // ─── Exportar reporte de diagnóstico ───────────────────────────────────────
  ipcMain.handle('export-report', async (event, reportData) => {
    try {
      // Intentar escritorio; si falla (permisos), caer a Documentos
      const desktopPath   = path.join(os.homedir(), 'Desktop')
      const docsPath      = path.join(os.homedir(), 'Documents')
      const timestamp     = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      const fileName      = `Reporte_SENTIByte_${timestamp}.json`

      let targetDir = desktopPath
      try {
        if (!fs.existsSync(desktopPath)) targetDir = docsPath
        fs.accessSync(desktopPath, fs.constants.W_OK)
      } catch {
        targetDir = docsPath
      }

      // Asegurarse que la carpeta existe
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })

      const filePath = path.join(targetDir, fileName)
      const content  = JSON.stringify(reportData, null, 2)
      fs.writeFileSync(filePath, content, 'utf8')

      return { success: true, path: filePath }
    } catch (error) {
      console.error('[tools] export-report:', error)
      return { success: false, message: `Error al exportar el reporte: ${error.message}` }
    }
  })
}

module.exports = { register }