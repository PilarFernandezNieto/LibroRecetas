<script setup>
import { RouterLink } from 'vue-router'
import { computed, inject } from 'vue'
import { useIngredienteStore } from '../stores/ingredienteStore'
import EditButton from './EditButton.vue'
import DeleteButton from './DeleteButton.vue'
import { useImagen } from '../composables/useImagen'

const ingredienteStore = useIngredienteStore()
const swal = inject('$swal')
const { getImagen } = useImagen()
const props = defineProps({
  ingrediente: {
    type: Object,
    required: true,
  },
})

const showAlert = (id) => {
  swal({
    icon: 'warning',
    text: '¿Seguro que desea eliminar el ingrediente',
    showDenyButton: true,
    confirmButtonText: 'Adelante',
    denyButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      ingredienteStore.eliminarIngrediente(id)
    }
  })
}
</script>
<template>
  <div
    class="shadow-md p-4 space-y-4 bg-white flex flex-col col-span-1 md:col-span-6 lg:col-span-3 xl:col-span-2"
  >
    <div class="space-y-2 pr-2">
      <h4 class="font-black text-xl text-center min-h-[84px]">
        {{ ingrediente.nombre }}
      </h4>
    </div>
    <div class="flex flex-col gap-4">
      <div v-if="getImagen(ingrediente.imagen)" class="flex justify-center lg:mb-0">
        <img
          :src="getImagen(ingrediente.imagen)"
          :alt="ingrediente.nombre"
          class="w-full rounded-md"
          loading="lazy"
        />
      </div>
      <div v-else>
        <img src="/img/no_img.png" class="w-full h-full object-cover" />
      </div>

      <div class="flex flex-col justify-center gap-1">
        <EditButton :to="{ name: 'editar-ingrediente', params: { id: ingrediente.id } }"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="w-6 h-6 stroke-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </EditButton>
        <DeleteButton @click="showAlert(ingrediente.id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            class="w-6 h-6 stroke-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </DeleteButton>
      </div>
    </div>
  </div>
</template>
