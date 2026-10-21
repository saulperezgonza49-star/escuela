<template>
  <div class="bg-gray-800 p-5 rounded-2xl border border-gray-700/60 shadow-lg">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-gray-400 font-medium text-sm">Memoria RAM</h2>
      <span class="text-xs text-gray-400">
        {{ used }} GB / {{ total }} GB
      </span>
    </div>

    <div class="flex items-baseline space-x-2">
      <span class="text-4xl font-extrabold text-indigo-400">{{ percent }}</span>
      <span class="text-xl font-semibold text-indigo-400/80">%</span>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full bg-gray-700 rounded-full h-2.5 mt-4 overflow-hidden">
      <div 
        class="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        :style="{ width: percent + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  percent: { type: [Number, String], default: 0 },
  used: { type: [Number, String], default: 0 },
  total: { type: [Number, String], default: 0 }
})
</script>