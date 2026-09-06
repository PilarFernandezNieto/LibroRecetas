<script setup>
defineProps({
  type: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center px-6 py-2.5 bg-transparent border-2 border-verde rounded-sm font-principal font-semibold text-sm text-verde hover:text-crema hover:bg-verde focus:outline-none focus:ring-2 focus:ring-verde-200 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
  >
    <slot />
  </button>
</template>
