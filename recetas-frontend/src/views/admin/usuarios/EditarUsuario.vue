<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import InputLabel from '../../../components/InputLabel.vue'
import TextInput from '../../../components/TextInput.vue'
import PrimaryButton from '../../../components/PrimaryButton.vue'
import GoBackButton from '../../../components/GoBackButton.vue'
import InputError from '../../../components/InputError.vue'
import Checkbox from '../../../components/Checkbox.vue'
import { useUsuarioStore } from '../../../stores/usuarioStore'
const usuarioStore = useUsuarioStore()
const route = useRoute()
const id = route.params.id

onMounted(async () => {
  await usuarioStore.fetchUser(id)
})

const processing = ref(false)
const errors = ref({})

const handleUser = async () => {
  await usuarioStore.editarUser(id, processing, errors, usuarioStore.usuario)
}

const adminChecked = computed({
  get: () => !!usuarioStore.usuario.is_admin,
  set: (val) => {
    usuarioStore.usuario.is_admin = val ? true : false
  },
})
</script>
<template>
  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-3xl text-gray-700 leading-tight">Editar usuario</h2>
    </template>
    <div class="py-12">
      <div class="w-[90%] lg:w-contenedor-sm md:w-3/4 mx-auto sm:px-6 lg:px-8">
        <div class="bg-amber-50 overflow-hidden shadow-sm sm:rounded-md py-4 px-4 md:px-8">
          <div class="bg-white shadow-sm p-4 rounded-md">
            <form @submit.prevent="handleUser">
              <div class="mb-4">
                <InputLabel for="name" value="Nombre" />

                <TextInput
                  id="name"
                  type="text"
                  class="mt-2 block w-full"
                  v-model="usuarioStore.usuario.name"
                  autofocus
                />
                <InputError class="mt-2" :message="errors.name?.[0]" />
              </div>
              <div class="mb-4">
                <InputLabel for="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  class="mt-2 block w-full"
                  v-model="usuarioStore.usuario.email"
                  autofocus
                />
                <InputError class="mt-2" :message="errors.email?.[0]" />
              </div>
              <div class="mb-4">
                <TextInput
                  id="password"
                  type="hidden"
                  class="mt-2 block w-full"
                  v-model="usuarioStore.usuario.password"
                  autofocus
                />
                <InputError class="mt-2" :message="errors.password?.[0]" />
              </div>
              <div class="mb-4">
                <InputLabel for="is_admin" value="Admin" />
                <Checkbox v-model:checked="adminChecked" />
              </div>

              <PrimaryButton
                class="w-full mt-2"
                :class="{ 'opacity-25': processing }"
                :disabled="processing"
              >
                Guardar Cambios
              </PrimaryButton>
            </form>
            <GoBackButton class="w-full mt-2">Atrás</GoBackButton>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
