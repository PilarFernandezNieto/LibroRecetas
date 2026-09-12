<script setup>
import { onMounted, ref } from 'vue'

defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
    default: '',
  },
})

defineEmits(['update:modelValue'])

const input = ref(null)

onMounted(() => {
  if (input.value.hasAttribute('autofocus')) {
    input.value.focus()
  }
})

defineExpose({ focus: () => input.value.focus() })
</script>

<template>
  <input
    class="border-terracota-oscuro bg-papel focus:border-terracota-oscuro focus:ring-terrborder-terracota-oscuro rounded-sm shadow-sm placeholder-gray-500"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    ref="input"
  />
</template>
