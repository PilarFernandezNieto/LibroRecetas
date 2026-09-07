<script setup>
import { inject } from 'vue'
import EditButton from './EditButton.vue'
import DeleteButton from './DeleteButton.vue'
import { useCategoriaStore } from '../stores/categoriaStore'

const categoriaStore = useCategoriaStore()
const swal = inject('$swal')
const props = defineProps({ categoria: { type: Object, required: true } })

const showAlert = (id) => {
  swal({
    icon: 'warning',
    text: '¿Seguro que desea eliminar la categoría',
    showDenyButton: true,
    confirmButtonText: 'Adelante',
    denyButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) categoriaStore.eliminarCategoria(id)
  })
}
</script>
<template>
  <div class="flex bg-crema justify-between items-center p-4 border-b border-papel font-principal">
    <h4 class="font-principal text-xl text-verde-900">{{ categoria.nombre }}</h4>
    <div class="flex justify-center gap-2">
      <EditButton :to="{ name: 'editar-categoria', params: { id: categoria.id } }"> </EditButton>
      <DeleteButton @click="showAlert(categoria.id)"> </DeleteButton>
    </div>
  </div>
</template>
