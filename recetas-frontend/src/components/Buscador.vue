<script setup>
const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue']) // Para emitir el cambio de valor al padre

// Cuando el valor cambie, emitimos el nuevo valor al componente padre
const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>
<template>
  <div class="w-72 mx-auto flex justify-center py-5">
    <input
      type="text"
      class="w-full p-2 border border-green-900 rounded-l-md focus:outline-none focus:ring-green-900 placeholder-gray-500"
      placeholder="Buscar"
      :value="modelValue"
      @input="onInput"
    />
    <i
      class="fa-solid fa-magnifying-glass bg-green-900 hover:bg-green-950 text-white p-3 rounded-r-md border border-green-900"
    ></i>
  </div>
</template>
