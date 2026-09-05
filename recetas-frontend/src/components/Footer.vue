<script setup>
import ApplicationLogo from './ApplicationLogo.vue';

let anio = new Date().getFullYear()
</script>
<template>
  <div class="flex flex-col justify-center items-center">
    <ApplicationLogo class="block w-48"/>
    <p class="text-sm">Todos los derechos reservados. {{ anio }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
