<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps({
  to: { type: [String, Object], required: true },
  active: { type: Boolean },
})
const classes = computed(() =>
  props.active
    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-verde font-principal text-base font-medium leading-5 text-verde-900 focus:outline-none focus:border-verde-900 transition duration-150 ease-in-out'
    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent font-principal text-base font-medium leading-5 text-verde-900/60 hover:text-verde hover:border-verde focus:outline-none focus:text-verde focus:border-verde transition duration-150 ease-in-out',
)
</script>
<template>
  <RouterLink :to="to" :class="classes">
    <slot />
  </RouterLink>
</template>
