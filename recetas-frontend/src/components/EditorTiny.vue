<script setup>
import Editor from '@tinymce/tinymce-vue'
const tinymceApiKey = import.meta.env.VITE_TINYMCE_API_KEY
</script>
<template>
  <Editor
    :api-key="tinymceApiKey"
    :init="{
      plugins: 'lists link code',
      toolbar: 'undo redo | bold italic underline | bullist numlist | outdent indent link code',
      language_url: '/langs/es.js',
      language: 'es',
    }"
  />
</template>
