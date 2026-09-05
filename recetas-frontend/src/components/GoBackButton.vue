<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  type: {
    type: String,
    default: 'button',
  },
  to: {
    type: String,
    default: '',
  },
})
const goBack = () => {
  if (props.to) {
    router.push(props.to)
  } else {
    router.go(-1)
  }
}
</script>

<template>
  <button
    @click="goBack"
    class="inline-flex items-center justify-center px-6 py-2.5 bg-transparent border-2 border-verde rounded-calido font-principal font-semibold text-sm text-verde hover:bg-verde hover:text-crema focus:outline-none disabled:opacity-25 transition ease-in-out duration-150"
  >
    <slot />
  </button>
</template>
