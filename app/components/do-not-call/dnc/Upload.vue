<script setup lang="ts">
import { BaseFileUploader, DoNotCallDncRinglessList, Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'
import ProfileVoiceAiFileUpload from '@/components/profile/voice-ai/FileUpload.vue'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Separator } from '~/components/ui/separator'

const showDialog = ref(false)
const showRinglessConfigure = ref(false)

function openCreateListDialog() {
  showDialog.value = true
  showRinglessConfigure.value = false
}

function closeConfigureDialog() {
  showRinglessConfigure.value = false
  showDialog.value = false
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  file: z.any().refine(val => val && val.length > 0, 'File is required'),
  campaign: z.string().min(1, 'Campaign is required'),
  checkDuplicates: z.boolean().optional(),
})

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    title: '',
    file: [],
    campaign: '',
    checkDuplicates: false,
  },
})

const { setValue: setFile } = useField('file')

function handleFileUpdate(files: File[]) {
  setFile(files)
}

// function onSubmit(_values: any) {
//   // handle submit
// }

function closeDialog() {
  showDialog.value = false
  setFile([])
}

function onNext() {
  closeDialog()
  showRinglessConfigure.value = true
}
</script>

<template>
  <Dialog v-model:open="showDialog">
    <DialogTrigger as-child>
      <Button variant="outline" @click="openCreateListDialog">
        <Icon name="material-symbols:upload" size="20" />
        Upload Excel
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ form.values.file.length === 0 ? 'Upload Excel' : 'Create Ringless List' }}
        </DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <Form :form="form">
        <div class="space-y-4">
          <FormField name="file">
            <FormItem>
              <FormLabel v-if="form.values.file.length > 0">
                Uploaded File
              </FormLabel>
              <FormControl>
                <BaseFileUploader accept=".xlc,.xlxs,.csv" max-size="5MB" @update:files="handleFileUpdate" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter class="flex flex-row justify-between items-center mt-6">
          <Button type="button" variant="outline" class="w-[49%] border-red-500 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600" @click="closeDialog">
            <Icon name="material-symbols:close" class="w-4 h-4 mr-1" size="20" />
            Discard
          </Button>
          <Button type="button" class="w-[49%]" :disabled="form.values.file.length === 0" @click="onNext">
            <Icon name="material-symbols:check" class="w-4 h-4 mr-1" size="20" />
            Next
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  </Dialog>
  <DoNotCallDncRinglessList :open="showRinglessConfigure" @update:open="val => { showRinglessConfigure = val; if (!val) closeConfigureDialog() }" />
</template>
