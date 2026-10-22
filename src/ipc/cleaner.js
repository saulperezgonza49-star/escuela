const { ipcMain } = require('electron')
const fs   = require('fs')
const os   = require('os')
const path = require('path')

function register() {
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
        } catch {
          // Ignorar archivos en uso por Windows
        }
      }
      const freedMB = (freedBytes / 1024 / 1024).toFixed(2)
      return { success: true, freedMB, deletedFilesCount }
    } catch (error) {
      console.error('[cleaner] Error:', error)
      return { success: false, message: 'Error al acceder a la carpeta de temporales.' }
    }
  })
}

module.exports = { register }