<script setup>
import { inject } from 'vue'
import EditButton from './EditButton.vue'
import DeleteButton from './DeleteButton.vue'
import { useIngredienteStore } from '../stores/ingredienteStore'
import { useImagen } from '../composables/useImagen'

const ingredienteStore = useIngredienteStore()
const swal = inject('$swal')
const { getImagen } = useImagen()
const props = defineProps({ ingrediente: { type: Object, required: true } })

const showAlert = (id) => {
  swal({
    icon: 'warning',
    text: '¿Seguro que desea eliminar el ingrediente',
    showDenyButton: true,
    confirmButtonText: 'Adelante',
    denyButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) ingredienteStore.eliminarIngrediente(id)
  })
}
</script>
<template>
  <div
    class="grid md:grid-cols-12 gap-1 lg:gap-4 items-center bg-crema p-5 border-b border-papel font-principal"
  >
    <div class="col-span-1">
      <div class="w-12 h-12 rounded-sm overflow-hidden bg-papel">
        <img
          v-if="getImagen(ingrediente.imagen)"
          :src="getImagen(ingrediente.imagen)"
          :alt="ingrediente.nombre"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <img v-else src="/img/no_img.png" class="w-full h-full object-cover" />
      </div>
    </div>
    <p class="text-base col-span-3 text-verde-900">{{ ingrediente.nombre }}</p>
    <p class="col-span-5 text-verde-900/80 truncate">{{ ingrediente.descripcion }}</p>
    <div class="flex justify-center gap-2 col-span-3">
      <EditButton :to="{ name: 'editar-ingrediente', params: { id: ingrediente.id } }">
      </EditButton>
      <DeleteButton @click="showAlert(ingrediente.id)"></DeleteButton>
    </div>
  </div>
</template>
