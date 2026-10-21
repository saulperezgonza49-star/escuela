<template>
  <div 
    class="p-5 rounded-2xl border transition-colors shadow-sm"
    :class="isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'"
  >
    <h2 class="font-medium text-sm mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-500'">Almacenamiento (Discos)</h2>

    <div class="space-y-4">
      <div 
        v-for="disk in disks" 
        :key="disk.mount" 
        class="p-3.5 rounded-xl border transition-colors"
        :class="isDark ? 'bg-gray-950/60 border-gray-800' : 'bg-gray-50 border-gray-200'"
      >
        <div class="flex justify-between items-center text-sm mb-1.5">
          <div class="flex items-center space-x-2">
            <span class="font-bold font-mono" :class="isDark ? 'text-emerald-400' : 'text-emerald-600'">{{ disk.mount }}</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-md" :class="disk.usePercent > 85 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : (isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-700')">
              {{ disk.usePercent }}%
            </span>
          </div>
          <span class="text-xs font-mono" :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ disk.usedGB }} GB / {{ disk.sizeGB }} GB</span>
        </div>
        
        <div class="w-full rounded-full h-2 mt-2 overflow-hidden" :class="isDark ? 'bg-gray-800' : 'bg-gray-200'">
          <div 
            class="h-2 rounded-full transition-all duration-500"
            :class="disk.usePercent > 85 ? 'bg-red-500' : (isDark ? 'bg-emerald-400' : 'bg-emerald-600')"
            :style="{ width: disk.usePercent + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  disks: { type: Array, default: () => [] },
  isDark: { type: Boolean, default: true }
})
</script>