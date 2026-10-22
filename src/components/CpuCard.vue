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
      <span class="text-4xl font-extrabold" :class="isDark ? 'text-cyan-400' : 'text-cyan-600'">{{ displayValue }}</span>
      <span class="text-xl font-semibold" :class="isDark ? 'text-cyan-400/80' : 'text-cyan-600/80'">%</span>
    </div>

    <!-- Barra de progreso — ancho sincronizado con el número -->
    <div class="w-full rounded-full h-2.5 mt-4 overflow-hidden" :class="isDark ? 'bg-gray-800' : 'bg-gray-200'">
      <div 
        class="h-2.5 rounded-full"
        :class="isDark ? 'bg-cyan-400' : 'bg-cyan-600'"
        :style="{ width: displayValue + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  usage: { type: [Number, String], default: 0 },
  temp:  { type: [Number, String], default: '--' },
  isDark: { type: Boolean, default: true }
})

// Valor animado: número y barra siempre van juntos
const displayValue = ref(Number(props.usage) || 0)
let rafId = null

function animateTo(target) {
  if (rafId) cancelAnimationFrame(rafId)

  const start     = displayValue.value
  const end       = Number(target) || 0
  const duration  = 600  // ms — un poco más que el intervalo de fetch (2000ms) para suavidad
  const startTime = performance.now()

  function step(now) {
    const elapsed  = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    // ease-out: desacelera al llegar al valor real
    const eased    = 1 - Math.pow(1 - progress, 3)
    displayValue.value = Math.round(start + (end - start) * eased)

    if (progress < 1) {
      rafId = requestAnimationFrame(step)
    } else {
      displayValue.value = end
      rafId = null
    }
  }

  rafId = requestAnimationFrame(step)
}

watch(() => props.usage, (newVal) => {
  animateTo(newVal)
})
</script>