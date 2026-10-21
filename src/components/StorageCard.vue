<template>
  <div class="bg-gray-800/80 backdrop-blur p-5 rounded-2xl border border-gray-700/60 shadow-lg">
    <h2 class="text-gray-400 font-medium text-sm mb-4">Almacenamiento (Discos)</h2>

    <div class="space-y-4">
      <div v-for="disk in disks" :key="disk.mount" class="bg-gray-900/60 p-3 rounded-xl border border-gray-700/40">
        <div class="flex justify-between items-center text-sm mb-1">
          <span class="font-bold text-emerald-400">{{ disk.mount }}</span>
          <span class="text-xs text-gray-400">{{ disk.usedGB }} GB / {{ disk.sizeGB }} GB</span>
        </div>
        
        <div class="w-full bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
          <div 
            class="h-2 rounded-full transition-all duration-500"
            :class="disk.usePercent > 85 ? 'bg-red-500' : 'bg-emerald-400'"
            :style="{ width: disk.usePercent + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  disks: { type: Array, default: () => [] }
})
</script>