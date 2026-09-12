<script setup>
defineProps({
  value: { type: String },
})
</script>
<template>
  <label
    v-bind="$attrs"
    class="block font-principal font-semibold text-xs text-antracita/80 uppercase tracking-wide"
  >
    <span v-if="value">{{ value }}</span>
    <span v-else><slot /></span>
  </label>
</template>
