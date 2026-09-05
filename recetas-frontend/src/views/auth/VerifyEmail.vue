<script setup>
import AuthLayout from '../../layouts/AuthLayout.vue'
import PrimaryButton from '../../components/PrimaryButton.vue'
import { useAuthStore } from '../../stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { user, resendEmailVerification, logout } = useAuthStore()

const router = useRouter()


const processing = ref(false)
const status = ref(null)

const handleResendEmailVerification = async () => await resendEmailVerification(processing, status)
</script>

<template>
  <AuthLayout>
    <div class="mb-4 text-sm text-gray-600">
      Gracias por registrarte. Antes de continuar debes verificar tu correo. Si no has recibido el
      email de confirmación puedes solicitar otro.
    </div>

    <div
      class="mb-4 font-medium text-sm text-green-700 bg-green-100 px-4 py-2 rounded"
      v-if="status"
    >
      Un nuevo enlace de verificación ha sido enviado a la dirección de correo electrónico que
      proporcionaste durante el registro.
    </div>

    <form @submit.prevent="handleResendEmailVerification()">
      <div class="mt-4 flex items-center justify-between">
        <PrimaryButton :class="{ 'opacity-25': processing }" :disabled="processing">
          Reenviar correo de verificación
        </PrimaryButton>

        <button @click="logout()" class="underline text-sm text-gray-600 hover:text-green-800">
          Cierra Sesión
        </button>
      </div>
    </form>
  </AuthLayout>
</template>

<style scoped></style>
