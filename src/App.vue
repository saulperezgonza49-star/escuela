<template>
  <div :class="isDark ? 'dark bg-gray-950 text-white' : 'bg-gray-100 text-gray-900'" class="min-h-screen flex font-sans transition-colors duration-300">
    
    <!-- Sidebar -->
    <aside class="w-64 border-r p-5 flex flex-col justify-between" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div>
        <div class="mb-8">
          <h1 class="text-xl font-black tracking-wide" :class="accentColorClass">SENTIByte</h1>
          <p class="text-[10px]" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ metrics.manufacturer }} {{ metrics.model }}</p>
        </div>

        <nav class="space-y-2">
          <!-- Botón Estado General -->
          <button 
            @click="currentTab = 'dashboard'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'dashboard' ? activeNavClass : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span>Estado General</span>
          </button>

          <!-- Botón Procesos Activos -->
          <button 
            @click="currentTab = 'processes'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'processes' ? activeNavClass : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>Procesos Activos</span>
          </button>

          <!-- Botón Limpiador Temp -->
          <button 
            @click="currentTab = 'optimizer'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'optimizer' ? activeNavClass : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            <span>Limpiador Temp</span>
          </button>

          <!-- Botón Hardware y Batería -->
          <button 
            @click="currentTab = 'hardware'"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'hardware' ? activeNavClass : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>Hardware y Batería</span>
          </button>

          <!-- Botón Herramientas Pro -->
          <button 
            @click="currentTab = 'tools'; fetchAdvancedTools()"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'tools' ? activeNavClass : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>Herramientas Pro</span>
          </button>

          <!-- Botón Servicios Windows -->
          <button 
            @click="currentTab = 'services'; fetchServices()"
            class="w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-3 cursor-pointer"
            :class="currentTab === 'services' ? activeNavClass : (isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50')"
          >
            <svg class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            <span>Servicios Windows</span>
          </button>
        </nav>
      </div>

      <!-- Footer Sidebar con Selector de Color -->
      <div class="space-y-3 pt-4 border-t" :class="isDark ? 'border-gray-800' : 'border-gray-200'">
        
        <!-- Selector de Color de Acento -->
        <div class="flex items-center justify-between px-1">
          <span class="text-[11px] text-gray-400">Acento:</span>
          <div class="flex space-x-1.5">
            <button @click="accent = 'cyan'" class="w-3.5 h-3.5 rounded-full bg-cyan-400 hover:scale-110 transition-transform"></button>
            <button @click="accent = 'emerald'" class="w-3.5 h-3.5 rounded-full bg-emerald-400 hover:scale-110 transition-transform"></button>
            <button @click="accent = 'indigo'" class="w-3.5 h-3.5 rounded-full bg-indigo-400 hover:scale-110 transition-transform"></button>
            <button @click="accent = 'violet'" class="w-3.5 h-3.5 rounded-full bg-violet-400 hover:scale-110 transition-transform"></button>
          </div>
        </div>

        <button 
          @click="isDark = !isDark" 
          class="w-full p-2.5 rounded-xl border transition-all flex items-center justify-center space-x-2 text-xs font-semibold cursor-pointer"
          :class="isDark ? 'bg-gray-950 border-gray-700 text-amber-400 hover:bg-gray-800' : 'bg-gray-50 border-gray-300 text-indigo-600 hover:bg-gray-100 shadow-sm'"
        >
          <svg v-if="isDark" class="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
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
      
      <!-- Alerta Crítica de Temperatura (> 85°C) -->
      <div v-if="parseFloat(metrics.cpuTemp) > 85" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-between animate-pulse">
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 stroke-current fill-none stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <span class="text-xs font-bold">¡ALERTA DE TEMPERATURA CRÍTICA! La CPU ha superado los 85°C ({{ metrics.cpuTemp }}°C). Verifique ventilación.</span>
        </div>
      </div>

      <!-- PESTAÑA 1: DASHBOARD -->
      <div v-if="currentTab === 'dashboard'" class="space-y-6">
        
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
                    <button @click="killProcess(proc.pid)" class="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-[11px] font-medium cursor-pointer">Finalizar Tarea</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 3: OPTIMIZADOR -->
      <div v-if="currentTab === 'optimizer'" class="space-y-6">
        <div class="p-6 rounded-2xl border shadow-sm text-center py-12" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <div class="max-w-md mx-auto space-y-4">
            <h2 class="text-xl font-bold">Limpiador de Archivos Temporales</h2>
            <p class="text-xs text-gray-400">Elimina el caché y los archivos temporales (%TEMP%) acumulados para liberar espacio.</p>
            <button @click="runCleaner" :disabled="cleaning" class="px-6 py-3 rounded-xl bg-cyan-500 text-gray-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer shadow-lg">
              {{ cleaning ? 'Limpiando...' : 'Escanear y Limpiar Basura' }}
            </button>
            <div v-if="cleanResult" class="mt-4 p-4 rounded-xl border text-xs font-medium flex items-center space-x-2 justify-center">
              <span>Se liberaron <strong>{{ cleanResult.freedMB }} MB</strong> eliminando {{ cleanResult.deletedFilesCount }} archivos.</span>
            </div>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 4: HARDWARE Y BATERÍA -->
      <div v-if="currentTab === 'hardware'" class="space-y-6">
        <div class="mb-4">
          <h2 class="text-lg font-bold">Diagnóstico de Hardware y Red</h2>
        </div>
        <BatteryNetCard :battery="advancedHardware.battery" :network="advancedHardware.network" :isDark="isDark" />
      </div>

      <!-- PESTAÑA 5: HERRAMIENTAS PRO -->
      <div v-if="currentTab === 'tools'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-2xl border shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
            <h3 class="font-medium text-sm mb-3">Tarjeta Gráfica (GPU)</h3>
            <p class="text-base font-bold">{{ hardwareSpecs.gpu }}</p>
            <p class="text-xs text-gray-400 mt-1">VRAM: {{ hardwareSpecs.vram }}</p>
          </div>
          <div class="p-5 rounded-2xl border shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
            <h3 class="font-medium text-sm mb-3">Placa Base y BIOS</h3>
            <p class="text-base font-bold">{{ hardwareSpecs.motherboard }}</p>
            <p class="text-xs text-gray-400 mt-1">BIOS: {{ hardwareSpecs.biosVersion }}</p>
          </div>
        </div>
      </div>

      <!-- PESTAÑA 6: SERVICIOS WINDOWS -->
      <div v-if="currentTab === 'services'" class="space-y-6">
        <div class="p-6 rounded-2xl border shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
          <h2 class="text-lg font-bold mb-1">Administrador de Servicios de Windows</h2>
          <p class="text-xs text-gray-400 mb-4">Detén servicios en segundo plano para optimizar el rendimiento general.</p>

          <div class="overflow-x-auto max-h-96">
            <table class="w-full text-left text-xs">
              <thead class="border-b" :class="isDark ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'">
                <tr>
                  <th class="py-3 px-4">Nombre</th>
                  <th class="py-3 px-4">Estado</th>
                  <th class="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y" :class="isDark ? 'divide-gray-800/50' : 'divide-gray-100'">
                <tr v-for="svc in windowsServices" :key="svc.Name" class="hover:bg-gray-50/50 transition-colors">
                  <td class="py-3 px-4 font-mono font-semibold">{{ svc.DisplayName || svc.Name }}</td>
                  <td class="py-3 px-4"><span :class="svc.Status === 4 ? 'text-emerald-400' : 'text-gray-400'">{{ svc.Status === 4 ? 'Ejecutándose' : 'Detenido' }}</span></td>
                  <td class="py-3 px-4 text-right">
                    <button @click="stopService(svc.Name)" class="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-[11px] font-medium cursor-pointer">Detener</button>
                  </td>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import CpuCard from './components/CpuCard.vue'
import RamCard from './components/RamCard.vue'
import StorageCard from './components/StorageCard.vue'
import Recommendations from './components/Recommendations.vue'
import BatteryNetCard from './components/BatteryNetCard.vue'

const isDark = ref(true)
const accent = ref('cyan') // cyan, emerald, indigo, violet
const currentTab = ref('dashboard')
const cleaning = ref(false)
const cleanResult = ref(null)
const flushing = ref(false)
const exporting = ref(false)
const startupApps = ref([])
const windowsServices = ref([])
const hardwareSpecs = ref({ gpu: 'Cargando...', vram: '--', motherboard: 'Cargando...', biosVersion: '--' })

const accentColorClass = computed(() => {
  switch (accent.value) {
    case 'emerald': return isDark.value ? 'text-emerald-400' : 'text-emerald-600'
    case 'indigo': return isDark.value ? 'text-indigo-400' : 'text-indigo-600'
    case 'violet': return isDark.value ? 'text-violet-400' : 'text-violet-600'
    default: return isDark.value ? 'text-cyan-400' : 'text-cyan-600'
  }
})

const activeNavClass = computed(() => {
  switch (accent.value) {
    case 'emerald': return isDark.value ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
    case 'indigo': return isDark.value ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm'
    case 'violet': return isDark.value ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-violet-50 text-violet-700 border border-violet-200 shadow-sm'
    default: return isDark.value ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-sm'
  }
})

const metrics = ref({ healthScore: 100, manufacturer: '', model: '', cpuUsage: 0, cpuTemp: '--', ramPercent: 0, ramUsed: 0, ramTotal: 0, disks: [], topProcess: null, processesList: [] })
const advancedHardware = ref({ battery: { percent: 100, isCharging: false, health: 100 }, network: { rx_sec: '0.00', tx_sec: '0.00' } })

let timer = null
let running = false

const fetchMetrics = async () => {
  if (running) return
  running = true
  try {
    if (window.api && window.api.getSystemStatus) {
      metrics.value = await window.api.getSystemStatus()
    }
  } finally {
    running = false
    timer = setTimeout(fetchMetrics, 2000)
  }
}

const fetchServices = async () => {
  if (window.api && window.api.getWindowsServices) {
    windowsServices.value = await window.api.getWindowsServices()
  }
}

const stopService = async (name) => {
  if (window.api && window.api.stopWindowsService) {
    const res = await window.api.stopWindowsService(name)
    alert(res.message)
    fetchServices()
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
    const res = await window.api.exportReport({ software: 'SENTIByte', system: metrics.value, exportedAt: new Date().toLocaleString() })
    if (res.success) alert(`Reporte guardado en Escritorio:\n${res.path}`)
  }
  exporting.value = false
}

const fetchAdvancedTools = async () => {
  if (window.api && window.api.getGpuMotherboard) {
    hardwareSpecs.value = await window.api.getGpuMotherboard()
  }
}

const killProcess = async (pid) => {
  if (window.api && window.api.killProcess) {
    await window.api.killProcess(pid)
    fetchMetrics()
  }
}

const runCleaner = async () => {
  cleaning.value = true
  if (window.api && window.api.cleanTempFiles) {
    cleanResult.value = await window.api.cleanTempFiles()
  }
  cleaning.value = false
  fetchMetrics()
}

onMounted(() => { fetchMetrics() })
onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>