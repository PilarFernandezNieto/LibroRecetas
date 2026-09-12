<script setup>
import { computed, inject } from 'vue'
import EditButton from './EditButton.vue'
import DeleteButton from './DeleteButton.vue'
import { useUsuarioStore } from '../stores/usuarioStore'

const usuarioStore = useUsuarioStore()
const swal = inject('$swal')
const props = defineProps({ usuario: { type: Object, required: true } })

const showAlert = (id) => {
  swal({
    icon: 'warning',
    text: '¿Seguro que desea eliminar el usuario',
    showDenyButton: true,
    confirmButtonText: 'Adelante',
    denyButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) usuarioStore.eliminarUsuario(id)
  })
}
const is_admin = computed(() => (props.usuario.is_admin ? 'Admin' : 'User'))
</script>
<template>
  <div
    class="grid md:grid-cols-12 gap-1 lg:gap-4 items-center bg-crema p-5 border-b border-papel font-principal"
  >
    <p class="text-base col-span-2 text-antracita">{{ usuario.name }}</p>
    <p class="text-base col-span-4 text-antracita/80">{{ usuario.email }}</p>
    <p class="col-span-3 uppercase text-xs tracking-wide text-antracita/60">{{ is_admin }}</p>
    <div class="flex justify-center gap-2 col-span-3">
      <EditButton :to="{ name: 'editar-usuario', params: { id: usuario.id } }"> </EditButton>
      <DeleteButton @click="showAlert(usuario.id)"> </DeleteButton>
    </div>
  </div>
</template>
