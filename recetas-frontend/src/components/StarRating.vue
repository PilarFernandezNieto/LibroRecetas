<script setup>
import { computed } from 'vue'

const props = defineProps({
  // puede llegar '' esde un formulari vacío, por eso admite también texto
  modelValue: {
    type: [Number, String],
    default: 0,
  },

  // false: solo muestra la valoración (admite decimales). true: permite elegirla
  editable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// Nombre único por instancia: los radios de un mismo tipo comparten "name"
const nombre = `estrellas-${Math.random().toString(36).slice(2)}`

const valor = computed(() => Number(props.modelValue) || 0)

// Anchura del relleno de las estrellas: 3.5 de 5 70%:
const porcentaje = computed(() => (valor.value / 5) * 100)
</script>
<template>
  <!-- Modo a elegir -->
  <fieldset v-if="editable" class="flex gap-1">
    <legend class="sr-only">Valoración</legend>
    <label v-for="n in 5" :key="n" class="cursor-pointer">
      <input
        type="radio"
        :name="nombre"
        :value="n"
        :checked="valor === n"
        :aria-label="'${n} de 5'"
        class="peer sr-only"
        @change="emit('update:modelValue', n)"
      />
      <span
        class="text-3xl leading-none rounded-sm peer-focus-visible:ring-2 peer-focus-visible:ring-terracota"
        :class="n <= valor ? 'text-terracota' : 'text-antracita'"
        >★</span
      >
    </label>
  </fieldset>

  <!-- Modo mostrar -->
  <span
    v-else
    role="img"
    :aria-label="`${valor} de 5`"
    class="relative inline-block text-xl leading-none"
  >
    <span class="text-antracita/20">★★★★★</span>
    <span
      class="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-terracota"
      :style="{ width: `${porcentaje}%` }"
      >★★★★★</span
    >
  </span>
</template>
