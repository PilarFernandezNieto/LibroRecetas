<script setup>
const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])

const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>
<template>
  <form
    role="search"
    aria-label="Buscar recetas"
    class="w-full max-w-xl mx-auto flex items-center gap-2 bg-antracita rounded-calido py-2 pl-5 pr-2 my-2 shadow-lg shadow-antracita/20"
    @submit.prevent
  >
    <i class="fa-solid fa-magnifying-glass text-crema/70 text-sm"></i>
    <input
      type="search"
      class="w-full border-none outline-none bg-transparent flex-1 py-2.5 text-crema placeholder-crema/50 font-principal text-sm focus:ring-0"
      placeholder="Buscar recetas, ingredientes…"
      aria-label="Buscar recetas, ingredientes"
      :value="modelValue"
      @input="onInput"
    />
    <button
      type="submit"
      class="bg-verde-200 text-verde-900 border-none rounded-calido px-6 py-2.5 text-sm font-principal font-semibold cursor-pointer shrink-0 hover:bg-crema transition-colors"
    >
      Buscar
    </button>
  </form>
</template>
