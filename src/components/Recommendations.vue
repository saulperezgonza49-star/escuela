<template>
  <div 
    class="p-5 rounded-2xl border transition-colors shadow-sm"
    :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'"
  >
    <h2 class="font-medium text-sm mb-3" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Diagnóstico y Recomendaciones</h2>

    <div v-if="tips.length === 0" class="flex items-center space-x-2 text-sm" :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">
      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
      <span>Todo marcha excelente. Tu equipo está funcionando dentro de parámetros normales.</span>
    </div>

    <ul v-else class="space-y-2">
      <li 
        v-for="(tip, index) in tips" 
        :key="index" 
        class="flex items-start space-x-2 text-sm p-2.5 rounded-lg border transition-colors"
        :class="isDark ? 'text-amber-400 bg-amber-950/30 border-amber-800/30' : 'text-amber-700 bg-amber-50 border-amber-200'"
      >
        <span class="font-bold">•</span>
        <span>{{ tip }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cpuUsage: [Number, String],
  ramPercent: [Number, String],
  disks: Array,
  topProcess: Object,
  isDark: { type: Boolean, default: true }
})

const tips = computed(() => {
  const list = []
  
  if (props.cpuUsage > 80 && props.topProcess) {
    list.push(`El procesador está sobrecargado. El proceso "${props.topProcess.name}" es el que más recursos consume (${props.topProcess.cpu}%).`)
  } else if (props.cpuUsage > 80) {
    list.push('El uso de procesador está muy alto. Revisa si hay procesos en segundo plano consumiendo recursos.')
  }

  if (props.ramPercent > 85) {
    list.push('La memoria RAM está al límite. Considera cerrar pestañas o aplicaciones pesadas.')
  }

  if (props.disks) {
    props.disks.forEach(d => {
      if (d.usePercent > 85) {
        list.push(`El disco ${d.mount} tiene más del 85% lleno. Te recomendamos liberar espacio.`)
      }
    })
  }
  return list
})
</script>