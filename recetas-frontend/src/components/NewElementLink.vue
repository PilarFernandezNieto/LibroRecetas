<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
})
</script>

<template>
  <RouterLink
    :to="to"
    class="inline-flex items-center justify-center px-5 py-2.5 bg-verde border border-transparent rounded-sm font-principal font-semibold text-sm text-crema hover:bg-verde-900 focus:bg-verde-800 active:bg-verde-900 focus:outline-none transition ease-in-out duration-150"
  >
    <slot />
  </RouterLink>
</template>
