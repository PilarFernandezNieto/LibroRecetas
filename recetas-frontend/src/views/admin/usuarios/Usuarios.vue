<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import NewElementLink from '../../../components/NewElementLink.vue'
import { FwbSpinner } from 'flowbite-vue'
import Usuario from '../../../components/Usuario.vue'
import { useUsuarioStore } from '../../../stores/usuarioStore'

const usuarioStore = useUsuarioStore()
onMounted(() => {
  usuarioStore.fetchUsers()
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Listado de usuarios</h2>
    </template>

    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-amber-50 overflow-hidden shadow-sm sm:rounded-md py-4 px-4 md:px-8">
          <template v-if="usuarioStore.loading">
            <div class="flex justify-center mb-8">
              <fwb-spinner size="10" color="green" />
            </div>
          </template>
          <div class="">
            <Usuario
              v-for="usuario in usuarioStore.usuarios"
              :key="usuario.id"
              :usuario="usuario"
            />
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<style scoped></style>
