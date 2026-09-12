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
    class="inline-flex items-center justify-center px-5 py-2.5 bg-crema border border-terracota rounded-sm font-semibold text-xs text-terracota hover:text-crema uppercase tracking-widest shadow-sm hover:bg-terracota focus:outline-none focus:ring-2 focus:ring-terracota focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
  >
    <slot />
  </button>
</template>
