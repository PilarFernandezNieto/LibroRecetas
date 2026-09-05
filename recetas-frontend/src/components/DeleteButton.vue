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
    class="inline-flex items-center justify-center p-1 bg-red-500 border border-transparent rounded-md font-semibold text-white tracking-widest hover:bg-red-700 focus:bg-red-500 active:bg-red-500 focus:outline-none transition ease-in-out duration-150"
  >
    <slot />
  </button>
</template>
