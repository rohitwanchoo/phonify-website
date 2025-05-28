<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { defineExpose, ref } from 'vue'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'

const isOpen = ref(false)
const uploadedFiles = ref<File[]>([])

// Form validation schema - only for title
const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title must be less than 50 characters'),
}))

const { handleSubmit, values, errors } = useForm({
  validationSchema: formSchema,
})

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function handleFileChange(event: Event) {
  const files = (event.target as HTMLInputElement)?.files
  if (files) {
    uploadedFiles.value = Array.from(files)
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files) {
    uploadedFiles.value = Array.from(files)
  }
}

function removeFile(index: number) {
  uploadedFiles.value.splice(index, 1)
}

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted with values:', values)
  close()
})

defineExpose({ open })
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="font-medium text-primary">
          Caller Details
        </DialogTitle>
        <Separator />
      </DialogHeader>

      <form class="space-y-4">
        <div class="py-4 space-y-4">
          <!-- List Name Input - Now a validated form field -->
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <p class="text-primary">
                Title
              </p>
              <FormControl>
                <Input
                  placeholder="Enter list name"
                  class="text-sm"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
              <div>{{ errors }}</div>
            </FormItem>
          </FormField>

          <!-- Drag & Drop Upload Area - Outside the form validation -->
          <div v-if="uploadedFiles.length === 0">
            <div
              class="w-full p-4 mt-2 border-2 border-dashed border-[#00A086] text-sm text-muted-foreground rounded-md cursor-pointer bg-[#F0F9F8] hover:bg-muted/80 transition min-h-[20%] flex flex-col items-center justify-center"
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
                  accept=".csv, .xls, .xlsx"
                  @change="handleFileChange"
                >
              </label>
            </div>

            <!-- File Info -->
            <div class="text-xs font-light text-muted-foreground flex justify-between mt-1">
              <p>Supported formats: XLS, XLSX, CSV</p>
              <p>Maximum size: 5MB</p>
            </div>
          </div>

          <!-- Show Uploaded File -->
          <div v-else class="flex items-center justify-between px-3 py-2 bg-muted text-sm rounded-md">
            <div class="flex gap-3 items-center justify-center ">
              <Icon name="icons:excel" size="26" />
              <div>
                <div class="truncate max-w-[300px] mr-3">
                  <span class="text-primary font-semibold">{{ uploadedFiles[0]?.name }}</span>
                </div>
                <div>
                  <p class="text-xs text-gray-600">
                    Excel 2.3mb
                  </p>
                </div>
              </div>
            </div>
            <button type="button" class="text-primary hover:text-primary/90" @click="removeFile(0)">
              <Icon name="lucide:trash" size="18" />
            </button>
          </div>

          <!-- Campaign Name -->
          <div>
            <p class="text-sm text-primary">
              Campaign Name
            </p>
            <div class="text-sm text-primary p-3 rounded-md mt-2 bg-muted">
              Campaign #1
            </div>
          </div>

          <!-- Check for duplicates (dummy toggle placeholder) -->
          <div class="flex items-center justify-between text-xs font-light text-muted-foreground mt-6">
            <p class="text-sm font-medium text-primary">
              Check for duplicates
            </p>
            <div>
              <Input type="checkbox" class="size-4" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            class="w-[50%] hover:text-red-500 text-red-500 border-red-500 hover:bg-red-50 h-10"
            variant="outline"
            type="button"
            @click="close"
          >
            <Icon name="lucide:x" />
            Close
          </Button>
          <Button class="w-[50%] h-10" type="submit" @click="onSubmit">
            <Icon name="lucide:check" />
            Next
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
