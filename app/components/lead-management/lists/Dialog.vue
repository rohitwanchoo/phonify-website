<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'
import ProfileVoiceAiFileUpload from '@/components/profile/voice-ai/FileUpload.vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import ConfigureListDialog from './ConfigureListDialog.vue'

const showDialog = ref(false)
const showConfigureDialog = ref(false)

function openCreateListDialog() {
  showDialog.value = true
  showConfigureDialog.value = false
}

function closeConfigureDialog() {
  showConfigureDialog.value = false
  showDialog.value = false
}

const campaignOptions = [
  { label: 'Campaign 1', value: 'campaign1' },
  { label: 'Campaign 2', value: 'campaign2' },
  { label: 'Campaign 3', value: 'campaign3' },
]

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

function onSubmit(_values: any) {
  // handle submit
}

function closeDialog() {
  showDialog.value = false
}

function onNext() {
  closeDialog()
  showConfigureDialog.value = true
}
</script>

<template>
  <Dialog v-model:open="showDialog">
    <DialogTrigger as-child>
      <Button @click="openCreateListDialog">
        <Icon class="!text-white" name="lucide:plus" />
        Create Lists
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create List</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new list.
        </DialogDescription>
      </DialogHeader>
      <Form :form="form">
        <div class="space-y-4">
          <FormField name="title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input v-model="form.values.title" placeholder="Enter title" class="text-xs md:text-sm" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="file">
            <FormItem>
              <FormLabel>File Upload</FormLabel>
              <FormControl>
                <ProfileVoiceAiFileUpload @update:files="handleFileUpdate" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="campaign">
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-model="form.values.campaign">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select campaign" class="text-xs md:text-sm" />
                  </SelectTrigger>
                  <SelectContent class="w-full">
                    <SelectItem v-for="option in campaignOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="checkDuplicates">
            <FormItem>
              <div class="flex items-center justify-between w-full">
                <FormLabel class="mb-0">
                  Check for duplicates
                </FormLabel>
                <FormControl>
                  <Checkbox :checked="form.values.checkDuplicates" @update:checked="form.values.checkDuplicates = $event" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter class="flex flex-row justify-between items-center mt-6">
          <Button type="button" variant="outline" class="w-[49%] border-red-500 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600" @click="closeDialog">
            <Icon name="lucide:x" class="w-4 h-4 mr-1" />
            Discard
          </Button>
          <Button type="button" class="w-[49%]" @click="onNext">
            <Icon name="lucide:check" class="w-4 h-4 mr-1" />
            Next
          </Button>
        </DialogFooter>
      </Form>
    </DialogContent>
  </Dialog>
  <ConfigureListDialog :open="showConfigureDialog" @update:open="val => { showConfigureDialog = val; if (!val) closeConfigureDialog() }" />
</template>
