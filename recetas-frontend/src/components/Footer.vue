<script setup>
import ApplicationLogo from './ApplicationLogo.vue'

let anio = new Date().getFullYear()
</script>
<template>
  <div class="flex flex-col justify-center items-center gap-2">
    <ApplicationLogo class="block w-40" />
    <p class="text-sm text-antracita/70 font-principal">
      Todos los derechos reservados. {{ anio }}
      <span class="opacity-70">— recetas con alma desde casa</span>
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
