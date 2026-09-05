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
    class="inline-flex items-center justify-center px-4 py-2 bg-green-800 border border-transparent rounded-md font-semibold text-sm text-white tracking-widest hover:bg-green-950 focus:bg-green-900 active:bg-green-950 focus:outline-none transition ease-in-out duration-150"
  >
    <slot />
  </RouterLink>
</template>
