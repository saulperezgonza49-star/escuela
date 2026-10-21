<template>
  <div class="bg-gray-800/80 backdrop-blur p-5 rounded-2xl border border-gray-700/60 shadow-lg">
    <h2 class="text-gray-400 font-medium text-sm mb-3">Diagnóstico y Recomendaciones</h2>

    <div v-if="tips.length === 0" class="flex items-center space-x-2 text-emerald-400 text-sm">
      <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
      <span>Todo marcha excelente. Tu equipo está funcionando dentro de parámetros normales.</span>
    </div>

    <ul v-else class="space-y-2">
      <li v-for="(tip, index) in tips" :key="index" class="flex items-start space-x-2 text-amber-400 text-sm bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/30">
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
  disks: Array
})

const tips = computed(() => {
  const list = []
  if (props.cpuUsage > 80) {
    list.push('El uso de procesador está muy alto. Revisa si hay procesos en segundo plano consumiendo recursos.')
  }
  if (props.ramPercent > 85) {
    list.push('La memoria RAM casi se agota. Considera cerrar pestañas o aplicaciones pesadas.')
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