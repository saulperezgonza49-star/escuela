<template>
  <div 
    class="p-5 rounded-2xl border transition-colors shadow-sm"
    :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'"
  >
    <div class="flex justify-between items-center mb-3">
      <h2 class="font-medium text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Memoria RAM</h2>
      <span class="text-xs font-mono" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        {{ used }} GB / {{ total }} GB
      </span>
    </div>

    <div class="flex items-baseline space-x-2">
      <span class="text-4xl font-extrabold" :class="isDark ? 'text-indigo-400' : 'text-indigo-600'">{{ percent }}</span>
      <span class="text-xl font-semibold" :class="isDark ? 'text-indigo-400/80' : 'text-indigo-600/80'">%</span>
    </div>

    <!-- Barra de progreso -->
    <div class="w-full rounded-full h-2.5 mt-4 overflow-hidden" :class="isDark ? 'bg-gray-800' : 'bg-gray-200'">
      <div 
        class="h-2.5 rounded-full transition-all duration-500 ease-out"
        :class="isDark ? 'bg-indigo-500' : 'bg-indigo-600'"
        :style="{ width: percent + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  percent: { type: [Number, String], default: 0 },
  used: { type: [Number, String], default: 0 },
  total: { type: [Number, String], default: 0 },
  isDark: { type: Boolean, default: true }
})
</script>