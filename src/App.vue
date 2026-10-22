<template>
  <div :class="isDark ? 'dark bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'" class="min-h-screen flex font-sans transition-colors duration-300">
    
    <!-- Sidebar -->
    <aside class="w-64 border-r p-5 flex flex-col justify-between" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div>
        <div class="mb-8">
          <h1 class="text-xl font-black tracking-wide" :class="isDark ? 'text-cyan-400' : 'text-cyan-600'">SENTIByte</h1>
          <p class="text-[10px]" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ metrics.manufacturer }} {{ metrics.model }}</p>
        </div>

        <nav class="space-y-2">
          <!-- Botón Estado General -->
          <button 
            @click="currentTab = 'dashboard'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'dashboard' ? (isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm') : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span>Estado General</span>
          </button>

          <!-- Botón Procesos Activos -->
          <button 
            @click="currentTab = 'processes'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'processes' ? (isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm') : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>Procesos Activos</span>
          </button>

          <!-- Botón Limpiador Temp -->
          <button 
            @click="currentTab = 'optimizer'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'optimizer' ? (isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm') : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            <span>Limpiador Temp</span>
          </button>

          <!-- Botón Hardware y Batería -->
          <button 
            @click="currentTab = 'hardware'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'hardware' ? (isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm') : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>Hardware y Batería</span>
          </button>

          <!-- Botón Herramientas Pro -->
          <button 
            @click="currentTab = 'tools'; fetchAdvancedTools()"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'tools' ? (isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm') : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Herramientas Pro</span>
          </button>
        </nav>
      </div>

      <!-- Footer Sidebar -->
      <div class="space-y-3 pt-4 border-t" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
        <button 
          @click="isDark = !isDark" 
          class="w-full p-2.5 rounded-xl border transition-all flex items-center justify-center space-x-2 text-xs font-semibold cursor-pointer"
          :class="isDark ? 'bg-gray-950 border-gray-700 text-amber-400 hover:bg-gray-800' : 'bg-gray-50 border-gray-300 text-indigo-600 hover:bg-gray-100 shadow-sm'"
        >
          <!-- Ícono Sol -->
          <svg v-if="isDark" class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <!-- Ícono Luna -->
          <svg v-else class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          <span>{{ isDark ? 'Modo Claro' : 'Modo Oscuro' }}</span>
        </button>

        <div class="flex items-center justify-center space-x-2 px-3 py-1.5 rounded-full border text-center" :class="isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200 shadow-sm'">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-[11px] font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-600'">Monitoreo Activo</span>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 overflow-y-auto">
      
      <!-- PESTAÑA 1: DASHBOARD -->
      <div v-if="currentTab === 'dashboard'" class="space-y-6">
        
        <!-- Acciones Rápidas Globales -->
        <div class="flex items-center justify-end space-x-3 mb-2">
          <button 
            @click="handleFlushRam"
            :disabled="flushing"
            class="px-4 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
            :class="isDark ? 'bg-gray-900 border-gray-800 text-indigo-400 hover:bg-gray-800' : 'bg-white border-gray-200 text-indigo-600 hover:bg-gray-50'"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>{{ flushing ? 'Optimizando RAM...' : 'Liberar RAM' }}</span>
          </button>

          <button 
            @click="handleExportReport"
            :disabled="exporting"
            class="px-4 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
            :class="isDark ? 'bg-gray-900 border-gray-800 text-cyan-400 hover:bg-gray-800' : 'bg-white border-gray-200 text-cyan-600 hover:bg-gray-50'"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>{{ exporting ? 'Generando...' : 'Exportar Reporte' }}</span>
          </button>
        </div>

        <section class="p-6 rounded-2xl border flex items-center justify-between shadow-sm transition-colors" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div>
            <h2 class="text-xl font-bold mb-1" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ metrics.healthScore >= 80 ? 'Tu PC está saludable' : 'Tu PC requiere atención' }}
            </h2>
            <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ metrics.healthScore >= 80 ? 'Todos los sistemas están dentro de parámetros normales' : 'Se detectó alto consumo o espacio limitado en algunos componentes' }}
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="relative flex items-center justify-center w-20 h-20 rounded-full border-4 font-black text-2xl"
              :class="metrics.healthScore >= 80 ? (isDark ? 'border-emerald-400 text-emerald-400' : 'border-emerald-500 text-emerald-600') : 'border-amber-400 text-amber-500'">
              {{ metrics.healthScore }}
            </div>
          </div>
        </section>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CpuCard :usage="metrics.cpuUsage" :temp="metrics.cpuTemp" :isDark="isDark" />
          <RamCard :percent="metrics.ramPercent" :used="metrics.ramUsed" :total="metrics.ramTotal" :isDark="isDark" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StorageCard :disks="metrics.disks" :isDark="isDark" />
          <Recommendations :cpuUsage="metrics.cpuUsage" :ramPercent="metrics.ramPercent" :disks="metrics.disks" :topProcess="metrics.topProcess" :isDark="isDark" />
        </div>
      </div>

      <!-- PESTAÑA 2: PROCESOS ACTIVOS -->
      <div v-if="currentTab === 'processes'" class="space-y-6">
        <div class="p-6 rounded-2xl border shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="flex justify-between items-center mb-4">
            <div>
              <h2 class="text-lg font-bold">Administrador de Procesos</h2>
              <p class="text-xs text-gray-400">Cierra aplicaciones colgadas para liberar CPU y memoria RAM inmediatamente.</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="border-b" :class="isDark ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'">
                <tr>
                  <th class="py-3 px-4">PID</th>
                  <th class="py-3 px-4">Nombre del Proceso</th>
                  <th class="py-3 px-4">Uso CPU</th>
                  <th class="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isDark ? 'divide-gray-800/50' : 'divide-gray-100'">
                <tr v-for="proc in metrics.processesList" :key="proc.pid" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3 px-4 font-mono text-gray-500">{{ proc.pid }}</td>
                  <td class="py-3 px-4 font-mono font-semibold" :class="isDark ? 'text-cyan-400' : 'text-cyan-600'">{{ proc.name }}</td>
                  <td class="py-3 px-4 font-bold">{{ proc.cpu }}%</td>
                  <td class="py-3 px-4 text-right">
                    <button 
                      @click="killProcess(proc.pid)"
                      class="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-[11px] font-medium cursor-pointer"
                    >
                      Finalizar Tarea
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 3: OPTIMIZADOR / LIMPIADOR TEMP -->
      <div v-if="currentTab === 'optimizer'" class="space-y-6">
        <div class="p-6 rounded-2xl border shadow-sm text-center py-12" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="max-w-md mx-auto space-y-4">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <svg class="w-7 h-7 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <h2 class="text-xl font-bold">Limpiador de Archivos Temporales</h2>
            <p class="text-xs text-gray-400">Elimina el caché y los archivos temporales (%TEMP%) acumulados por aplicaciones para liberar espacio en el Disco C:.</p>

            <button 
              @click="runCleaner"
              :disabled="cleaning"
              class="px-6 py-3 rounded-xl bg-cyan-500 text-gray-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {{ cleaning ? 'Limpiando sistema...' : 'Escanear y Limpiar Basura' }}
            </button>

            <!-- Mensaje de Resultado -->
            <div v-if="cleanResult" class="mt-4 p-4 rounded-xl border text-xs font-medium flex items-center space-x-2 justify-center" :class="cleanResult.success ? (isDark ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700') : 'bg-red-950/30 border-red-800/40 text-red-400'">
              <svg v-if="cleanResult.success" class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span v-if="cleanResult.success">
                Limpieza completada. Se liberaron <strong>{{ cleanResult.freedMB }} MB</strong> eliminando {{ cleanResult.deletedFilesCount }} archivos temporales.
              </span>
              <span v-else>{{ cleanResult.message }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 4: HARDWARE Y BATERÍA -->
      <div v-if="currentTab === 'hardware'" class="space-y-6">
        <div class="mb-4">
          <h2 class="text-lg font-bold">Diagnóstico de Hardware y Red</h2>
          <p class="text-xs text-gray-400">Monitoreo del estado físico de la batería y flujo de datos de red en tiempo real.</p>
        </div>
        <BatteryNetCard :battery="advancedHardware.battery" :network="advancedHardware.network" :isDark="isDark" />
      </div>

      <!-- PESTAÑA 5: HERRAMIENTAS PRO (STARTUP & HARDWARE DETALLADO) -->
      <div v-if="currentTab === 'tools'" class="space-y-6">
        <div class="mb-4">
          <h2 class="text-lg font-bold">Herramientas y Diagnóstico Avanzado</h2>
          <p class="text-xs text-gray-400">Control de aplicaciones de arranque y especificaciones profundas de GPU y Placa Base.</p>
        </div>

        <!-- Tarjeta de GPU y Placa Base -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-2xl border shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
            <h3 class="font-medium text-sm mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Tarjeta Gráfica (GPU)</h3>
            <p class="text-base font-bold" :class="isDark ? 'text-cyan-400' : 'text-cyan-600'">{{ hardwareSpecs.gpu }}</p>
            <p class="text-xs text-gray-400 mt-1">VRAM: {{ hardwareSpecs.vram }}</p>
          </div>

          <div class="p-5 rounded-2xl border shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
            <h3 class="font-medium text-sm mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Placa Base y BIOS</h3>
            <p class="text-base font-bold" :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">{{ hardwareSpecs.motherboard }}</p>
            <p class="text-xs text-gray-400 mt-1">Versión BIOS: {{ hardwareSpecs.biosVersion }}</p>
          </div>
        </div>

        <!-- Gestor de Aplicaciones de Inicio -->
        <div class="p-6 rounded-2xl border shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <h3 class="text-base font-bold mb-1">Aplicaciones de Arranque (Startup)</h3>
          <p class="text-xs text-gray-400 mb-4">Programas configurados para iniciarse automáticamente con Windows.</p>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="border-b" :class="isDark ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'">
                <tr>
                  <th class="py-3 px-4">Nombre del Programa</th>
                  <th class="py-3 px-4">Ubicación / Registro</th>
                  <th class="py-3 px-4">Comando Ejecutable</th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isDark ? 'divide-gray-800/50' : 'divide-gray-100'">
                <tr v-for="(appItem, index) in startupApps" :key="index" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3 px-4 font-bold" :class="isDark ? 'text-cyan-400' : 'text-cyan-600'">{{ appItem.Name }}</td>
                  <td class="py-3 px-4 text-gray-400 font-mono text-[11px]">{{ appItem.Location }}</td>
                  <td class="py-3 px-4 text-gray-500 font-mono text-[11px] truncate max-w-xs">{{ appItem.Command }}</td>
                </tr>
                <tr v-if="startupApps.length === 0">
                  <td colspan="3" class="py-6 text-center text-gray-400">Cargando aplicaciones de inicio...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import CpuCard from './components/CpuCard.vue'
import RamCard from './components/RamCard.vue'
import StorageCard from './components/StorageCard.vue'
import Recommendations from './components/Recommendations.vue'
import BatteryNetCard from './components/BatteryNetCard.vue'

const isDark = ref(true)
const currentTab = ref('dashboard')
const cleaning = ref(false)
const cleanResult = ref(null)
const flushing = ref(false)
const exporting = ref(false)
const startupApps = ref([])
const hardwareSpecs = ref({ gpu: 'Cargando...', vram: '--', motherboard: 'Cargando...', biosVersion: '--' })

const metrics = ref({
  healthScore: 100,
  manufacturer: '',
  model: '',
  cpuUsage: 0,
  cpuTemp: '--',
  ramPercent: 0,
  ramUsed: 0,
  ramTotal: 0,
  disks: [],
  topProcess: null,
  processesList: []
})

const advancedHardware = ref({
  battery: { percent: 100, isCharging: false, health: 100 },
  network: { rx_sec: '0.00', tx_sec: '0.00' }
})

let timer = null
let running = false

const scheduleNext = () => {
  timer = setTimeout(fetchMetrics, 2000)
}

// Batería directo desde el renderer — no necesita admin
let batteryApi = null
async function getBatteryRenderer() {
  try {
    if (!batteryApi) batteryApi = await navigator.getBattery()
    const b = batteryApi
    return {
      percent:       Math.round(b.level * 100),
      isCharging:    b.charging,
      timeRemaining: b.chargingTime !== Infinity ? Math.round(b.chargingTime / 60) : 0,
      hasBattery:    true,
      health:        null  // la salud sigue viniendo del wmic
    }
  } catch {
    return null
  }
}

const fetchMetrics = async () => {
  if (running) return
  running = true
  try {
    // Métricas de sistema (CPU, RAM, disco, procesos)
    if (window.api && window.api.getSystemStatus) {
      const status = await window.api.getSystemStatus()
      metrics.value = status
    }

    // Hardware avanzado: red + salud de batería desde main
    if (window.api && window.api.getAdvancedHardware) {
      const adv = await window.api.getAdvancedHardware()

      // Sobreescribir datos de batería con navigator.getBattery() — más preciso, sin admin
      const battRenderer = await getBatteryRenderer()
      if (battRenderer) {
        adv.battery = {
          ...adv.battery,              // conservar health que viene del wmic
          percent:       battRenderer.percent,
          isCharging:    battRenderer.isCharging,
          timeRemaining: battRenderer.timeRemaining,
          hasBattery:    true
        }
      }

      advancedHardware.value = adv
    }
  } finally {
    running = false
    scheduleNext()
  }
}

const handleFlushRam = async () => {
  flushing.value = true
  if (window.api && window.api.flushRam) {
    const res = await window.api.flushRam()
    alert(res.message)
  }
  flushing.value = false
}

const handleExportReport = async () => {
  exporting.value = true
  if (window.api && window.api.exportReport) {
    const reportPayload = {
      software: 'SENTIByte - PC Health Monitor',
      system: metrics.value,
      hardware: advancedHardware.value,
      gpuDetails: hardwareSpecs.value,
      exportedAt: new Date().toLocaleString()
    }
    const res = await window.api.exportReport(reportPayload)
    if (res.success) {
      alert(`Reporte exportado exitosamente en tu Escritorio:\n${res.path}`)
    } else {
      alert(res.message)
    }
  }
  exporting.value = false
}

const fetchAdvancedTools = async () => {
  if (window.api && window.api.getStartupApps) {
    startupApps.value = await window.api.getStartupApps()
  }
  if (window.api && window.api.getGpuMotherboard) {
    hardwareSpecs.value = await window.api.getGpuMotherboard()
  }
}

const killProcess = async (pid) => {
  if (window.api && window.api.killProcess) {
    await window.api.killProcess(pid)
    clearTimeout(timer)
    running = false
    fetchMetrics()
  }
}

const runCleaner = async () => {
  cleaning.value = true
  cleanResult.value = null
  if (window.api && window.api.cleanTempFiles) {
    const res = await window.api.cleanTempFiles()
    cleanResult.value = res
  }
  cleaning.value = false
  clearTimeout(timer)
  running = false
  fetchMetrics()
}

onMounted(() => {
  fetchMetrics()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>