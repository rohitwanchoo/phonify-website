<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps<{
  modelValue: string
  contentType?: 'html' | 'text' | 'delta'
}>()

const emit = defineEmits(['update:modelValue', 'focus'])

const editorRef = ref<typeof QuillEditor | null>(null)

// Internal ref to keep sync
const localContent = ref(props.modelValue)
const showModal = ref(false)
const modalContent = ref('')

watch(() => props.modelValue, (val) => {
  if (val !== localContent.value)
    localContent.value = val
})

function updateContent(val: any) {
  localContent.value = val
  emit('update:modelValue', val)
}

function openModal() {
  modalContent.value = formatHTML(localContent.value)
  showModal.value = true
}

function saveModalContent() {
  localContent.value = modalContent.value
  emit('update:modelValue', modalContent.value)
  showModal.value = false
}

// Reset modal content when dialog closes
watch(showModal, (open) => {
  if (!open) {
    modalContent.value = ''
  }
})

function formatHTML(html: string): string {
  // Simple HTML formatting function
  let formatted = html
  let indent = 0
  const indentSize = 2

  // Add newlines before opening tags
  formatted = formatted.replace(/</g, '\n<')

  // Split by lines and process each line
  const lines = formatted.split('\n').filter(line => line.trim())

  return lines.map((line) => {
    const trimmedLine = line.trim()

    // Decrease indent for closing tags
    if (trimmedLine.startsWith('</')) {
      indent = Math.max(0, indent - indentSize)
    }

    const indentedLine = ' '.repeat(indent) + trimmedLine

    // Increase indent for opening tags (but not self-closing or closing tags)
    if (trimmedLine.startsWith('<')
      && !trimmedLine.startsWith('</')
      && !trimmedLine.endsWith('/>')
      && !['<br>', '<hr>', '<img', '<input', '<meta', '<link'].some(tag => trimmedLine.startsWith(tag))) {
      indent += indentSize
    }

    return indentedLine
  }).join('\n')
}

// Inject "View" button after mount
onMounted(() => {
  const toolbar = document.querySelector('.ql-toolbar')
  if (toolbar) {
    // check if already injected
    if (!toolbar.querySelector('.ql-view')) {
      const span = document.createElement('span')
      span.classList.add('ql-formats')

      const button = document.createElement('button')
      button.type = 'button'
      button.classList.add('ql-view')
      button.title = 'View/Edit HTML'
      // Add SVG icon inside button
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M0-360v-240h60v80h80v-80h60v240h-60v-100H60v100H0Zm310 0v-180h-70v-60h200v60h-70v180h-60Zm170 0v-200q0-17 11.5-28.5T520-600h180q17 0 28.5 11.5T740-560v200h-60v-180h-40v140h-60v-140h-40v180h-60Zm320 0v-240h60v180h100v60H800Z"/></svg>
      `

      button.addEventListener('click', openModal)

      span.appendChild(button)
      toolbar.appendChild(span)
    }
  }
})

defineExpose({ insertMergeField, setHTMLContent })

// Set HTML content into Quill by converting HTML to Delta
function setHTMLContent(html: string) {
  const quill = editorRef.value?.getQuill()
  if (!quill)
    return

  const delta = quill.clipboard.convert(html)
  quill.setContents(delta, 'api')
}

function insertMergeField(mergeField: string) {
  const quill = editorRef.value?.getQuill()
  if (!quill)
    return

  const selection = quill.getSelection()

  if (selection) {
    const index = selection.index

    quill.insertText(index, mergeField)
  }
  else {
    // Handle cases where no selection is active (e.g., insert at end)
    quill.insertText(quill.getLength(), mergeField)
  }
}
onMounted(() => {
  // console.log(editorRef.value.hasFocus)
})
</script>

<template>
  <div>
    <!-- Quill Editor -->
    <QuillEditor
      ref="editorRef"
      v-model:content="localContent"
      :content-type="props.contentType || 'html'"
      theme="snow"
      toolbar="full"
      @focus="emit('focus')"
      @update:content="updateContent"
    />

    <!-- Dialog for showing/editing HTML -->
    <Dialog v-model:open="showModal">
      <DialogContent class="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>HTML Editor</DialogTitle>
          <DialogDescription>
            Edit the HTML content directly.
          </DialogDescription>
        </DialogHeader>

        <div class="flex-1 overflow-hidden">
          <div class="h-full flex flex-col">
            <textarea
              v-model="modalContent"
              class="min-h-[20dvh] flex-1 w-full p-4 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter HTML content here..."
            />
          </div>
        </div>

        <DialogFooter class="flex items-center justify-end gap-3">
          <DialogClose as-child>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button @click="saveModalContent">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped lang="css">
:deep(.ql-container) {
  height: max-content;
}
:deep(.ql-editor) {
  min-height: 100px;
  max-height: 300px;
  height: fit-content;
}
:deep(.ql-toolbar.ql-snow) {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
:deep(.ql-container.ql-snow) {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

/* Custom styles for better HTML formatting */
.prose {
  color: #374151;
}
.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}
.prose p {
  margin-bottom: 1em;
}
.prose ul, .prose ol {
  margin-bottom: 1em;
  padding-left: 1.5em;
}
.prose li {
  margin-bottom: 0.25em;
}
</style>
