<script setup>
import AuthLayout from '../../layouts/AuthLayout.vue'
import InputError from '../../components/InputError.vue'
import InputLabel from '../../components/InputLabel.vue'
import PrimaryButton from '../../components/PrimaryButton.vue'
import TextInput from '../../components/TextInput.vue'
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const email = ref('')
const processing = ref(false)
const errors = ref({})
const status = ref(null)
const { forgotPassword } = useAuthStore()
const handleForgotPassword = async () => await forgotPassword(processing, errors, status, email.value)
</script>

<template>
  <AuthLayout>
    <h1 class="font-titulares text-2xl text-verde-900 text-center mb-4">Recuperar contraseña</h1>
    <div class="mb-4 text-sm font-principal text-verde-900/70">
      ¿Olvidaste tu contraseña? No hay problema. Indícanos tu dirección de correo electrónico y te
      enviaremos un enlace para restablecerla y poder elegir una nueva.
    </div>
    <div v-if="status" class="mb-4 font-principal text-sm text-verde-900">{{ status }}</div>
    <form @submit.prevent="handleForgotPassword()">
      <div>
        <InputLabel for="email" value="Email" />
        <TextInput id="email" type="email" class="mt-1 block w-full" v-model="email" autofocus autocomplete="username" />
        <InputError class="mt-2" :message="errors.email?.[0]" />
      </div>
      <div class="flex items-center justify-end mt-4">
        <PrimaryButton class="w-full" :class="{ 'opacity-25': processing }" :disabled="processing">Restablecer contraseña</PrimaryButton>
      </div>
    </form>
    <RouterLink :to="{ name: 'home' }" class="mt-4 flex justify-center text-sm font-principal text-verde-900/70 hover:text-verde">Atrás</RouterLink>
  </AuthLayout>
</template>
