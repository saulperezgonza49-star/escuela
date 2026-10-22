const { ipcMain } = require('electron')
const { execSync } = require('child_process')

ipcMain.handle('get-windows-services', async () => {
  try {
    const psCommand = 'powershell "Get-Service | Select-Object Name, DisplayName, Status, StartType | ConvertTo-Json"'
    const output = execSync(psCommand, { encoding: 'utf8', timeout: 4000 }).trim()
    if (!output) return []
    const parsed = JSON.parse(output)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (error) {
    return []
  }
})

ipcMain.handle('stop-windows-service', async (event, serviceName) => {
  try {
    const psCommand = `powershell "Stop-Service -Name '${serviceName}' -Force -ErrorAction Stop"`
    execSync(psCommand, { timeout: 3000 })
    return { success: true, message: `Servicio ${serviceName} detenido correctamente.` }
  } catch (error) {
    return { success: false, message: 'No se pudo detener el servicio. Ejecuta como Administrador.' }
  }
})