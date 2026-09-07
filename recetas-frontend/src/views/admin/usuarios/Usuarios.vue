<script setup>
import { onMounted } from 'vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import NewElementLink from '../../../components/NewElementLink.vue'
import { FwbSpinner } from 'flowbite-vue'
import Usuario from '../../../components/Usuario.vue'
import { useUsuarioStore } from '../../../stores/usuarioStore'

const usuarioStore = useUsuarioStore()
onMounted(() => usuarioStore.fetchUsers())
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-titulares text-3xl text-verde-900 leading-tight">Listado de usuarios</h2>
    </template>

    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-papel overflow-hidden shadow-sm rounded-sm py-4 px-4 md:px-8">
          <template v-if="usuarioStore.loading">
            <div class="flex justify-center mb-8"><fwb-spinner size="10" color="green" /></div>
          </template>
          <div class="rounded-sm overflow-hidden border border-papel">
            <div
              class="grid md:grid-cols-12 gap-1 lg:gap-4 px-2 pb-2 border-b border-papel text-xs uppercase tracking-wide text-verde-900/50 font-principal"
            >
              <span class="col-span-2">Nombre</span><span class="col-span-4">Email</span
              ><span class="col-span-3">Rol</span><span class="col-span-3"></span>
            </div>
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
