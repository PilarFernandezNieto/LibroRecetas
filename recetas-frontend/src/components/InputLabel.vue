<script setup>
defineProps({
  value: {
    type: String,
  },
})
</script>

<template>
  <label v-bind="$attrs" class="block font-medium text-sm text-gray-700 uppercase">
    <span v-if="value">{{ value }}</span>
    <span v-else><slot /></span>
  </label>
</template>
