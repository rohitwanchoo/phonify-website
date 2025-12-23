<script setup lang="ts">
import { Button } from '@/components/ui/button'

const props = defineProps<{
  accept?: string
  maxSize?: string
}>()
const emit = defineEmits(['update:files'])
const uploadedFiles = ref<File[]>([])

const formattedAccept = computed(() => {
  return props.accept
    ?.split(',')
    .map(s => s.replace('.', '').toUpperCase())
    .join(', ')
})

const MAX_SIZE_BYTES = computed(() => {
  if (!props.maxSize)
    return 25 * 1024 * 1024 // default 25MB
  const value = Number.parseFloat(props.maxSize)
  if (Number.isNaN(value))
    return 25 * 1024 * 1024

  if (props.maxSize.toLowerCase().includes('kb'))
    return value * 1024
  if (props.maxSize.toLowerCase().includes('mb'))
    return value * 1024 * 1024
  if (props.maxSize.toLowerCase().includes('gb'))
    return value * 1024 * 1024 * 1024

  return value
})

const errorMessage = ref<string | null>(null)

function handleFileChange(event: Event) {
  const files = (event.target as HTMLInputElement)?.files
  if (files) {
    const selectedFiles = Array.from(files)
    const oversized = selectedFiles.find(file => file.size > MAX_SIZE_BYTES.value)

    if (oversized) {
      errorMessage.value = `File "${oversized.name}" exceeds ${props.maxSize} limit.`
      return
    }

    errorMessage.value = null
    uploadedFiles.value = selectedFiles
    emit('update:files', uploadedFiles.value)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files) {
    const selectedFiles = Array.from(files)
    const oversized = selectedFiles.find(file => file.size > MAX_SIZE_BYTES.value)

    if (oversized) {
      errorMessage.value = `File "${oversized.name}" exceeds ${props.maxSize} limit.`
      return
    }

    errorMessage.value = null
    uploadedFiles.value = selectedFiles
    emit('update:files', uploadedFiles.value)
  }
}

const uploadedFileInfo = computed(() => {
  const file = uploadedFiles.value[0]
  if (!file)
    return { type: '', size: '' }

  // Get extension from filename
  const extension = file.name.split('.').pop()?.toUpperCase() || 'File'

  // Format size
  let size = ''
  if (file.size >= 1024 * 1024) {
    size = `${(file.size / (1024 * 1024)).toFixed(1)} MB`
  }
  else if (file.size >= 1024) {
    size = `${(file.size / 1024).toFixed(1)} KB`
  }
  else {
    size = `${file.size} bytes`
  }

  return { type: extension, size }
})

function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1)
  errorMessage.value = null
  emit('update:files', uploadedFiles.value)
}
</script>

<template>
  <div class="space-y-2">
    <!-- Dropzone -->
    <div v-if="uploadedFiles.length === 0">
      <div
        class="w-full p-[80px] mt-2 border-2 border-dashed border-[#00A086] text-sm text-muted-foreground rounded-md cursor-pointer bg-[#F0F9F8] hover:bg-muted/80 transition min-h-[20%] flex flex-col items-center justify-center"
        @dragover.prevent
        @drop="handleDrop"
      >
        <label for="file-upload" class="text-center cursor-pointer">
          <Icon name="icons:upload" class="text-5xl" />
          <p>
            <span class="text-muted-foreground">Drag & drop your file here or </span>
            <span class="text-primary underline underline-offset-3">choose file</span>
          </p>
          <input
            id="file-upload"
            type="file"
            class="hidden"
            :accept="accept"
            @change="handleFileChange"
          >
        </label>
      </div>

      <!-- File Info -->
      <div class="text-xs font-light text-muted-foreground flex justify-between mt-1">
        <p v-if="!errorMessage">
          Supported formats: {{ formattedAccept }}
        </p>
        <p :class="errorMessage ? 'w-full flex justify-between' : ''">
          Maximum size: {{ props?.maxSize }}
          <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
        </p>
      </div>
    </div>

    <!-- File Preview -->
    <div
      v-else
      class="flex items-center justify-between px-3 py-2 bg-muted text-sm rounded-md"
    >
      <div class="flex gap-3 items-center">
        <Icon
          :name="{
            MP3: 'icons:mp3',
            PDF: 'icons:pdf',
            XLSX: 'icons:excel',
            XLC: 'icons:excel',
            CSV: 'icons:excel',
            XLS: 'icons:excel',
          }[uploadedFileInfo.type] || 'icons:document'"
          size="26"
        />

        <div>
          <div class="truncate max-w-[300px] mr-3">
            <span class="text-primary font-semibold">{{ uploadedFiles[0]?.name }}</span>
          </div>
          <p class="text-xs text-gray-600">
            {{ uploadedFileInfo.type }} {{ uploadedFileInfo.size }}
          </p>
        </div>
      </div>
      <Button variant="ghost" class="text-primary hover:text-primary/80" @click="removeFile(0)">
        <Icon name="material-symbols:delete" size="24" />
      </Button>
    </div>
  </div>
</template>
