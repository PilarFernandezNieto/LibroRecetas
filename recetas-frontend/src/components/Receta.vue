<script setup>
import { RouterLink } from 'vue-router'
import { inject } from 'vue'
import EditButton from './EditButton.vue'
import DeleteButton from './DeleteButton.vue'
import { useRecetaStore } from '../stores/recetaStore'
import { useImagen } from '../composables/useImagen'

const swal = inject('$swal')
const recetaStore = useRecetaStore()
const { getImagen } = useImagen()

const props = defineProps({ receta: { type: Object, required: true } })

const showAlert = (id) => {
  swal({
    icon: 'warning',
    text: '¿Seguro que desea eliminar esta receta?',
    showDenyButton: true,
    confirmButtonText: 'Adelante',
    denyButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) recetaStore.eliminarReceta(id)
  })
}
</script>

<template>
  <div
    class="grid md:grid-cols-12 gap-1 lg:gap-4 items-center bg-crema p-5 border-b border-papel font-principal"
  >
    <div class="col-span-1">
      <div class="w-12 h-12 rounded-suave overflow-hidden bg-papel">
        <img
          v-if="getImagen(receta.imagen)"
          :src="getImagen(receta.imagen)"
          :alt="receta.nombre"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <img v-else src="/img/no_img.png" class="w-full h-full object-cover" />
      </div>
    </div>
    <div class="col-span-3 min-w-0">
      <RouterLink
        :to="{ name: 'receta', params: { id: receta.id } }"
        class="font-titulares text-base text-verde-900 hover:text-verde block truncate"
        title="Ver receta"
        >{{ receta.nombre }}</RouterLink
      >
      <p class="text-sm text-verde-900/60 truncate">{{ receta.intro }}</p>
    </div>
    <p class="col-span-2 text-verde-900/80 truncate">{{ receta.categoria?.nombre }}</p>
    <p class="col-span-2 text-verde-900/80 truncate">{{ receta.dificultad?.nombre }}</p>
    <p class="col-span-1 text-verde-900/80 truncate">{{ receta.tiempo }}</p>
    <div class="flex justify-center gap-2 col-span-3">
      <EditButton :to="{ name: 'editar-receta', params: { id: receta.id } }"></EditButton>
      <DeleteButton @click="showAlert(receta.id)"></DeleteButton>
    </div>
  </div>
</template>
