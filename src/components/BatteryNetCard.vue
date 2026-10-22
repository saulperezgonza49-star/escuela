<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Tarjeta de Batería -->
    <div class="p-5 rounded-2xl border transition-colors shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-medium text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Estado de la Batería</h2>
        <span class="text-xs font-bold px-2.5 py-1 rounded-md" :class="battery.isCharging ? (isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-700 border border-amber-200') : (isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700')">
          {{ battery.isCharging ? '⚡ Conectada / Cargando' : '🔋 En batería' }}
        </span>
      </div>

      <div class="flex items-baseline space-x-2 mb-4">
        <span class="text-4xl font-extrabold" :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">{{ battery.percent }}</span>
        <span class="text-xl font-semibold" :class="isDark ? 'text-emerald-400/80' : 'text-emerald-600/80'">%</span>
      </div>

      <!-- Barra de Carga -->
      <div class="w-full rounded-full h-2.5 overflow-hidden mb-4" :class="isDark ? 'bg-gray-800' : 'bg-gray-200'">
        <div 
          class="h-2.5 rounded-full transition-all duration-500"
          :class="isDark ? 'bg-emerald-400' : 'bg-emerald-600'"
          :style="{ width: battery.percent + '%' }"
        ></div>
      </div>

      <div class="text-xs space-y-1" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        <p>Salud estimada de celda: <strong :class="isDark ? 'text-white' : 'text-gray-900'">{{ battery.health !== null ? battery.health + '%' : '--' }}</strong></p>
      </div>
    </div>

    <!-- Tarjeta de Red -->
    <div class="p-5 rounded-2xl border transition-colors shadow-sm" :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-medium text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Tráfico de Red</h2>
        <span class="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
      </div>

      <div class="space-y-4">
        <div class="p-3 rounded-xl border" :class="isDark ? 'bg-gray-950/60 border-gray-800' : 'bg-gray-50 border-gray-200'">
          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Velocidad de Bajada (Download)</p>
          <p class="text-2xl font-bold font-mono mt-1" :class="isDark ? 'text-cyan-400' : 'text-cyan-600'">{{ network.rx_sec }} <span class="text-xs font-sans font-normal text-gray-400">MB/s</span></p>
        </div>

        <div class="p-3 rounded-xl border" :class="isDark ? 'bg-gray-950/60 border-gray-800' : 'bg-gray-50 border-gray-200'">
          <p class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Velocidad de Subida (Upload)</p>
          <p class="text-2xl font-bold font-mono mt-1" :class="isDark ? 'text-indigo-400' : 'text-indigo-600'">{{ network.tx_sec }} <span class="text-xs font-sans font-normal text-gray-400">MB/s</span></p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
defineProps({
  battery: { type: Object, default: () => ({ percent: 100, isCharging: false, health: 100 }) },
  network: { type: Object, default: () => ({ rx_sec: '0.00', tx_sec: '0.00' }) },
  isDark: { type: Boolean, default: true }
})
</script>