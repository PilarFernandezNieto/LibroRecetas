<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { inject, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
const swal = inject('$swal')

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      HTMLAttributes: {
        target: null,
        rel: 'noopener noreferrer nofollow',
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
})

const setEnlace = async () => {
  const linkActual = editor.value.getAttributes('link')
  const urlActual = linkActual.href || ''
  const nuevaVentanaActual = linkActual.target === '_blank'

  const { value: formValues, isDenied } = await swal({
    title: 'Enlace',
    html: `
      <input id="swal-url" class="swal2-input" placeholder="https://..." value="${urlActual}">
      <label class="flex items-center justify-center gap-2 mt-2 text-sm">
        <input type="checkbox" id="swal-target" ${nuevaVentanaActual ? 'checked' : ''}>
        Abrir en una pestaña nueva
      </label>
    `,
    focusConfirm: false,
    showCancelButton: true,
    showDenyButton: !!urlActual,
    confirmButtonText: 'Guardar',
    denyButtonText: 'Quitar enlace',
    cancelButtonText: 'Cancelar',
    showClass: { popup: '' },
    hideClass: { popup: '' },
    preConfirm: () => {
      const url = document.getElementById('swal-url').value.trim()
      if (!url) {
        swal.showValidationMessage('Introduce una URL')
        return false
      }
      return { url, nuevaVentana: document.getElementById('swal-target').checked }
    },
  })

  if (isDenied) {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  if (!formValues) return

  editor.value
    .chain()
    .focus()
    .extendMarkRange('link')
    .setLink({ href: formValues.url, target: formValues.nuevaVentana ? '_blank' : null })
    .run()
}

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value, false)
    }
  },
)
</script>

<template>
  <div
    class="border border-papel bg-crema rounded-sm shadow-sm overflow-hidden focus-within:border-verde focus-within:ring-1 focus-within:ring-verde transition-colors"
  >
    <div class="flex flex-wrap gap-1 border-b border-papel bg-papel/40 px-3 py-2">
      <button
        type="button"
        @click="editor.chain().focus().toggleBold().run()"
        :class="editor?.isActive('bold') ? 'bg-verde text-crema' : 'text-verde-900 hover:bg-papel'"
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm font-bold rounded-sm transition-colors"
        title="Negrita"
      >
        B
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleItalic().run()"
        :class="
          editor?.isActive('italic') ? 'bg-verde text-crema' : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm italic rounded-sm transition-colors"
        title="Cursiva"
      >
        I
      </button>

      <div class="w-px shrink-0 bg-papel mx-1"></div>

      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="
          editor?.isActive('heading', { level: 2 })
            ? 'bg-verde text-crema'
            : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-xs font-bold rounded-sm transition-colors"
        title="Encabezado"
      >
        H2
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="
          editor?.isActive('heading', { level: 3 })
            ? 'bg-verde text-crema'
            : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-xs font-bold rounded-sm transition-colors"
        title="Subencabezado"
      >
        H3
      </button>

      <div class="w-px shrink-0 bg-papel mx-1"></div>

      <button
        type="button"
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="
          editor?.isActive('bulletList') ? 'bg-verde text-crema' : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm rounded-sm transition-colors"
        title="Lista"
      >
        <i class="fa-solid fa-list-ul"></i>
      </button>

      <button
        type="button"
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="
          editor?.isActive('orderedList') ? 'bg-verde text-crema' : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-xs rounded-sm transition-colors"
        title="Lista numerada"
      >
        <i class="fa-solid fa-list-ol"></i>
      </button>

      <div class="w-px shrink-0 bg-papel mx-1"></div>

      <button
        type="button"
        @click="setEnlace"
        :class="editor?.isActive('link') ? 'bg-verde text-crema' : 'text-verde-900 hover:bg-papel'"
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm rounded-sm transition-colors"
        title="Enlace"
      >
        <i class="fa-solid fa-link"></i>
      </button>

      <div class="w-px shrink-0 bg-papel mx-1"></div>

      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('left').run()"
        :class="
          editor?.isActive({ textAlign: 'left' })
            ? 'bg-verde text-crema'
            : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm rounded-sm transition-colors"
        title="Alinear a la izquierda"
      >
        <i class="fa-solid fa-align-left"></i>
      </button>

      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('center').run()"
        :class="
          editor?.isActive({ textAlign: 'center' })
            ? 'bg-verde text-crema'
            : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm rounded-sm transition-colors"
        title="Centrar"
      >
        <i class="fa-solid fa-align-center"></i>
      </button>

      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('right').run()"
        :class="
          editor?.isActive({ textAlign: 'right' })
            ? 'bg-verde text-crema'
            : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm rounded-sm transition-colors"
        title="Alinear a la derecha"
      >
        <i class="fa-solid fa-align-right"></i>
      </button>

      <button
        type="button"
        @click="editor.chain().focus().setTextAlign('justify').run()"
        :class="
          editor?.isActive({ textAlign: 'justify' })
            ? 'bg-verde text-crema'
            : 'text-verde-900 hover:bg-papel'
        "
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm rounded-sm transition-colors"
        title="Justificar"
      >
        <i class="fa-solid fa-align-justify"></i>
      </button>

      <div class="w-px shrink-0 bg-papel mx-1"></div>

      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
        :disabled="!editor?.can().undo()"
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm text-verde-900 hover:bg-papel disabled:opacity-30 rounded-sm transition-colors"
        title="Deshacer"
      >
        ↩
      </button>

      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
        :disabled="!editor?.can().redo()"
        class="w-8 h-8 shrink-0 flex items-center justify-center text-sm text-verde-900 hover:bg-papel disabled:opacity-30 rounded-sm transition-colors"
        title="Rehacer"
      >
        ↪
      </button>
    </div>

    <EditorContent
      :editor="editor"
      class="tiptap-editor min-h-48 font-principal text-sm text-verde-900"
    />
  </div>
</template>

<style scoped>
.tiptap-editor :deep(.tiptap) {
  outline: none;
  min-height: 12rem;
  background-color: #fffffe;
  padding: 1rem;
  border-radius: 4px;
}
.tiptap-editor :deep(p) {
  margin-bottom: 0.5rem;
  line-height: 1.75;
}
.tiptap-editor :deep(p:last-child) {
  margin-bottom: 0;
}
.tiptap-editor :deep(h2) {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-verde-900);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
.tiptap-editor :deep(h3) {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-verde-900);
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
}
.tiptap-editor :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}
.tiptap-editor :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}
.tiptap-editor :deep(li) {
  margin-bottom: 0.125rem;
}
.tiptap-editor :deep(li p) {
  margin-bottom: 0;
}
.tiptap-editor :deep(strong) {
  font-weight: 700;
}
.tiptap-editor :deep(em) {
  font-style: italic;
}
.tiptap-editor :deep(a) {
  color: var(--color-verde);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
.tiptap-editor :deep(a:hover) {
  color: var(--color-verde-900);
}
:global(.swal2-input) {
  width: 100%;
  margin: 0 auto;
}
</style>
