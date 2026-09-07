<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import InputLabel from '../../../components/InputLabel.vue'
import TextInput from '../../../components/TextInput.vue'
import PrimaryButton from '../../../components/PrimaryButton.vue'
import GoBackButton from '../../../components/GoBackButton.vue'
import InputError from '../../../components/InputError.vue'
import { useCategoriaStore } from '../../../stores/categoriaStore'
const categoriaStore = useCategoriaStore()
const route = useRoute()
const id = route.params.id

onMounted(async () => await categoriaStore.fetchCategoria(id))

const processing = ref(false)
const errors = ref({})

const handleCategoria = async () =>
  await categoriaStore.editarCategoria(id, processing, errors, categoriaStore.categoria)
</script>
<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-titulares text-3xl text-verde-900 leading-tight">Editar categoría</h2>
    </template>
    <div class="py-12">
      <div class="w-contenedor-sm mx-auto sm:px-6 lg:px-8">
        <div class="bg-papel overflow-hidden shadow-sm rounded-sm py-4 px-4 md:px-8">
          <div
            class="bg-crema border border-papel shadow-sm p-6 rounded-sm w-full lg:w-2/6 mx-auto"
          >
            <form @submit.prevent="handleCategoria">
              <div>
                <InputLabel for="nombre" value="Nombre" />
                <TextInput
                  id="nombre"
                  type="text"
                  class="mt-2 block w-full"
                  v-model="categoriaStore.categoria.nombre"
                  autofocus
                />
                <InputError class="mt-2" :message="errors.nombre?.[0]" />
              </div>
              <PrimaryButton
                class="w-full mt-4"
                :class="{ 'opacity-25': processing }"
                :disabled="processing"
                >Guardar cambios</PrimaryButton
              >
            </form>
            <GoBackButton class="w-full mt-2">Atrás</GoBackButton>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
