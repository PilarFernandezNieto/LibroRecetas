<script setup>
import ApplicationLogo from '../components/ApplicationLogo.vue'
</script>
<template>
  <div class="min-h-screen bg-papel flex flex-col items-center justify-center font-principal">
    <div class="flex items-center shrink-0">
      <RouterLink :to="{ name: 'home' }">
        <ApplicationLogo class="block w-56" />
      </RouterLink>
    </div>
    <div
      class="w-[90%] lg:w-[25%] mt-6 shadow-sm border border-papel overflow-hidden rounded-sm bg-crema p-6"
    >
      <slot />
    </div>
  </div>
</template>
