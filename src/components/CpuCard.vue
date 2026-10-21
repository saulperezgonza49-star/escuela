<template>
  <div 
    class="p-5 rounded-2xl border transition-colors shadow-sm"
    :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'"
  >
    <div class="flex justify-between items-center mb-3">
      <h2 class="font-medium text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Procesador (CPU)</h2>
      <span 
        class="text-xs px-2 py-1 rounded-full border"
        :class="isDark ? 'bg-cyan-950/50 text-cyan-400 border-cyan-800/50' : 'bg-cyan-50 text-cyan-700 border-cyan-200'"
      >
        {{ temp }} °C
      </span>
    </div>
    
    <div class="flex items-baseline space-x-2">
      <span class="text-4xl font-extrabold" :class="isDark ? 'text-cyan-400' : 'text-cyan-600'">{{ usage }}</span>
      <span class="text-xl font-semibold" :class="isDark ? 'text-cyan-400/80' : 'text-cyan-600/80'">%</span>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full rounded-full h-2.5 mt-4 overflow-hidden" :class="isDark ? 'bg-gray-800' : 'bg-gray-200'">
      <div 
        class="h-2.5 rounded-full transition-all duration-500 ease-out"
        :class="isDark ? 'bg-cyan-400' : 'bg-cyan-600'"
        :style="{ width: usage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  usage: { type: [Number, String], default: 0 },
  temp: { type: [Number, String], default: '--' },
  isDark: { type: Boolean, default: true }
})
</script>