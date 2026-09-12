<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps({
  to: { type: [String, Object], required: true },
  active: { type: Boolean },
})
const classes = computed(() =>
  props.active
    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-terracota font-principal text-base font-medium leading-5 text-antracita focus:outline-none focus:border-antracita transition duration-150 ease-in-out'
    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent font-principal text-base font-medium leading-5 text-antracita/60 hover:text-terracota hover:border-terracota focus:outline-none focus:text-terracota focus:border-terracota transition duration-150 ease-in-out',
)
</script>
<template>
  <RouterLink :to="to" :class="classes">
    <slot />
  </RouterLink>
</template>
