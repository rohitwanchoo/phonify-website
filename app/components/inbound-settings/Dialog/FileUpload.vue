<!-- components/FileDropzone.vue -->
<script setup lang="ts">
import { defineEmits, defineProps, ref } from 'vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  accept?: string
}>()
const emit = defineEmits(['update:files'])
const uploadedFiles = ref<File[]>([])

function handleFileChange(event: Event) {
  const files = (event.target as HTMLInputElement)?.files
  if (files) {
    uploadedFiles.value = Array.from(files)
    emit('update:files', uploadedFiles.value)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files) {
    uploadedFiles.value = Array.from(files)
    emit('update:files', uploadedFiles.value)
  }
}

function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1)
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
            :accept="accept || '.MP3, .WAV'"
            @change="handleFileChange"
          >
        </label>
      </div>

      <!-- File Info -->
      <div class="text-xs font-light text-muted-foreground flex justify-between mt-1">
        <p>Supported formats: MP3,WAV</p>
        <p>Maximum size: 25MB</p>
      </div>
    </div>

    <!-- File Preview -->
    <div
      v-else
      class="flex items-center justify-between px-3 py-2 bg-muted text-sm rounded-md"
    >
      <div class="flex gap-3 items-center">
        <Icon name="icons:excel" size="26" />
        <div>
          <div class="truncate max-w-[300px] mr-3">
            <span class="text-primary font-semibold">{{ uploadedFiles[0]?.name }}</span>
          </div>
          <p class="text-xs text-gray-600">
            Excel 2.3mb
          </p>
        </div>
      </div>
      <button type="button" class="text-primary hover:text-primary/90" @click="removeFile(0)">
        <Icon name="lucide:trash" size="18" />
      </button>
    </div>
  </div>
</template>
