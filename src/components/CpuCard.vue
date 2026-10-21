<template>
  <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700/60 shadow-lg">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-gray-400 font-medium text-sm">Procesador (CPU)</h2>
      <span class="text-xs px-2 py-1 rounded-full bg-cyan-900/50 text-cyan-400 border border-cyan-700/50">
        {{ temp }} °C
      </span>
    </div>
    
    <div class="flex items-baseline space-x-2">
      <span class="text-4xl font-extrabold text-cyan-400">{{ usage }}</span>
      <span class="text-xl font-semibold text-cyan-400/80">%</span>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full bg-gray-700 rounded-full h-2.5 mt-4 overflow-hidden">
      <div 
        class="bg-cyan-400 h-2.5 rounded-full transition-all duration-500 ease-out"
        :style="{ width: usage + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  usage: { type: [Number, String], default: 0 },
  temp: { type: [Number, String], default: '--' }
})
</script>