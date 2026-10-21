<template>
  <div class="min-h-screen bg-gray-950 text-white p-6 font-sans">
    <!-- Header principal -->
    <header class="mb-6 flex justify-between items-center border-b border-gray-800 pb-4">
      <div>
        <h1 class="text-2xl font-black tracking-wide text-cyan-400">SENTIByte</h1>
        <p class="text-xs text-gray-400">System & Hardware Monitor for Windows</p>
      </div>
      <div class="flex items-center space-x-2 bg-gray-900 px-3 py-1.5 rounded-full border border-gray-800">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-xs font-medium text-gray-300">Monitoreo activo</span>
      </div>
    </header>

    <!-- Score de Salud del Sistema -->
    <section class="bbg-linear-to-r from-gray-900 via-gray-850 to-gray-900 p-6 rounded-2xl border border-gray-800 mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-white mb-1">
          {{ metrics.healthScore >= 80 ? 'Tu PC está saludable' : 'Tu PC requiere atención' }}
        </h2>
        <p class="text-xs text-gray-400">
          {{ metrics.healthScore >= 80 ? 'Todos los sistemas están dentro de parámetros normales' : 'Se detectó alto consumo en algunos componentes' }}
        </p>
      </div>

      <!-- Anillo de puntuación -->
      <div class="flex items-center space-x-3">
        <div class="relative flex items-center justify-center w-20 h-20 rounded-full border-4"
          :class="metrics.healthScore >= 80 ? 'border-emerald-400' : 'border-amber-400'">
          <span class="text-2xl font-black" :class="metrics.healthScore >= 80 ? 'text-emerald-400' : 'text-amber-400'">
            {{ metrics.healthScore }}
          </span>
        </div>
      </div>
    </section>

    <!-- Grid de métricas -->
    <main class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <CpuCard :usage="metrics.cpuUsage" :temp="metrics.cpuTemp" />
      <RamCard :percent="metrics.ramPercent" :used="metrics.ramUsed" :total="metrics.ramTotal" />
    </main>

    <!-- Discos y Recomendaciones -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StorageCard :disks="metrics.disks" />
      <Recommendations :cpuUsage="metrics.cpuUsage" :ramPercent="metrics.ramPercent" :disks="metrics.disks" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import CpuCard from './components/CpuCard.vue'
import RamCard from './components/RamCard.vue'
import StorageCard from './components/StorageCard.vue'
import Recommendations from './components/Recommendations.vue'

const metrics = ref({
  healthScore: 100,
  cpuUsage: 0,
  cpuTemp: '--',
  ramPercent: 0,
  ramUsed: 0,
  ramTotal: 0,
  disks: []
})

let timer = null

const fetchMetrics = async () => {
  if (window.api && window.api.getSystemStatus) {
    const status = await window.api.getSystemStatus()
    metrics.value = status
  }
}

onMounted(() => {
  fetchMetrics()
  timer = setInterval(fetchMetrics, 2000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>