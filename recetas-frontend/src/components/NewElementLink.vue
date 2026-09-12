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
    class="inline-flex items-center justify-center px-5 py-2.5 bg-terracota border border-transparent rounded-sm font-principal font-semibold text-sm text-papel hover:bg-terracota-oscuro focus:bg-terracota-oscuro active:bg-terracota-oscuro focus:outline-none transition ease-in-out duration-150"
  >
    <slot />
  </RouterLink>
</template>
