<script setup>
import AuthLayout from '../../layouts/AuthLayout.vue'
import Checkbox from '../../components/Checkbox.vue'
import InputError from '../../components/InputError.vue'
import InputLabel from '../../components/InputLabel.vue'
import PrimaryButton from '../../components/PrimaryButton.vue'
import TextInput from '../../components/TextInput.vue'
import { useAuthStore } from '../../stores/auth'
import { ref, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const form = ref({ email: '', password: '', remember: false })
const processing = ref(false)
const errors = ref({})
const status = ref(null)
const route = useRoute()

watchEffect(() => {
  status.value = route.query.reset && route.query.reset?.length > 0 ? atob(route.query.reset) : null
})

const { login } = useAuthStore()
const handleLogin = async () => await login(processing, errors, form.value)
</script>

<template>
  <AuthLayout>
    <div v-if="status" class="mb-4 font-principal text-sm text-verde-900">{{ status }}</div>
    <h1 class="font-titulares text-2xl text-verde-900 text-center mb-6">Inicia sesión</h1>
    <form @submit.prevent="handleLogin()">
      <div>
        <InputLabel for="email" value="Email" />
        <TextInput id="email" type="email" class="mt-1 block w-full" v-model="form.email" autofocus autocomplete="username" />
        <InputError class="mt-2" :message="errors.email?.[0]" />
      </div>

      <div class="mt-4">
        <InputLabel for="password" value="Contraseña" />
        <TextInput id="password" type="password" class="mt-1 block w-full" v-model="form.password" autocomplete="current-password" />
        <InputError class="mt-2" :message="errors.password?.[0]" />
      </div>

      <div class="block mt-4">
        <label class="flex items-center gap-2">
          <Checkbox name="remember" v-model:checked="form.remember" />
          <span class="text-sm font-principal text-verde-900/70">Recordarme</span>
        </label>
      </div>

      <div class="flex flex-col md:flex-row md:justify-between items-center gap-2 my-4">
        <RouterLink :to="{ name: 'forgot-password' }" class="underline text-sm font-principal text-verde-900/70 hover:text-verde rounded-suave focus:outline-none">
          ¿Has olvidado tu contraseña?
        </RouterLink>
        <RouterLink :to="{ name: 'register' }" class="underline text-sm font-principal text-verde-900/70 hover:text-verde rounded-suave focus:outline-none">
          ¿Todavía no tienes cuenta?
        </RouterLink>
      </div>

      <PrimaryButton class="w-full" :class="{ 'opacity-25': processing }" :disabled="processing">Inicia sesión</PrimaryButton>
    </form>
    <RouterLink :to="{ name: 'home' }" class="mt-4 flex justify-center text-sm font-principal text-verde-900/70 hover:text-verde">Volver</RouterLink>
  </AuthLayout>
</template>
