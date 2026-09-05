<script setup>
import { ref } from 'vue'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import InputLabel from '../../../components/InputLabel.vue'
import TextInput from '../../../components/TextInput.vue'
import PrimaryButton from '../../../components/PrimaryButton.vue'
import GoBackButton from '../../../components/GoBackButton.vue'
import InputError from '../../../components/InputError.vue'
import { useCategoriaStore } from '../../../stores/categoriaStore'
const categoriaStore = useCategoriaStore()

const categoria = ref({
  nombre: '',
})

const processing = ref(false)
const errors = ref({})

const handleCategoria = async () => {
  await categoriaStore.nuevaCategoria(processing, errors, categoria.value)
}
</script>
<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Nueva Categoría</h2>
    </template>
    <div class="py-12">
      <div class="w-[90%] lg:w-full max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-amber-50 overflow-hidden shadow-sm sm:rounded-md py-4 px-4 md:px-8">
          <div class="bg-white shadow-sm p-4 rounded-md w-full lg:w-2/6 mx-auto">
            <form @submit.prevent="handleCategoria()">
              <div>
                <InputLabel for="nombre" value="Nombre" />

                <TextInput
                  id="nombre"
                  type="text"
                  class="mt-2 block w-full"
                  v-model="categoria.nombre"
                  autofocus
                />
                <InputError class="mt-2" :message="errors.nombre?.[0]" />
              </div>
              <PrimaryButton
                class="w-full mt-2"
                :class="{ 'opacity-25': processing }"
                :disabled="processing"
              >
                Nueva Categoría
              </PrimaryButton>
            </form>
            <GoBackButton class="w-full mt-2">Atrás</GoBackButton>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
