<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'

import { useFocus } from '@vueuse/core'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

const props = defineProps<Props>()
const emits = defineEmits(['complete'])
interface Props {
  campaignId?: number
}

const { user } = useAuth()
const showDialog = ref(false)
// const showConfigureDialog = ref(false)

const focusInput = shallowRef()
useFocus(focusInput, { initialValue: true })

const { data: campaigns, refresh: refreshCampaigns, status: campaignsStatus } = await useLazyAsyncData('create-list-campaign', () =>
  useApi().post('/campaign'), {
  transform: res => res.data,
  immediate: false,
})

// Allowed file types
const ALLOWED_FILE_TYPES = ['.xlc', '.xlsx', '.csv', '.xls']
const ALLOWED_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
]

// File validation function
function validateFileType(files: File[]) {
  if (files.length === 0)
    return false

  const file = files[0]
  const fileName = file?.name.toLowerCase() ?? ''
  const fileExtension = fileName.substring(fileName.lastIndexOf('.'))

  // Check file extension
  const hasValidExtension = ALLOWED_FILE_TYPES.includes(fileExtension)

  // Check MIME type
  const hasValidMimeType = file?.type ? ALLOWED_MIME_TYPES.includes(file.type) : true

  return hasValidExtension && hasValidMimeType
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  file: z.array(z.instanceof(File))
    .min(1, 'File is required')
    .refine(
      files => validateFileType(files),
      'Invalid file type. Please upload .xlc, .xlsx, .csv, or .xls files only',
    ),
  campaign: z.number().optional(),
  duplicate_check: z.boolean().optional(),
})
const file = ref<File>()

const { handleSubmit, resetForm, setFieldError } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    title: '',
    file: [],
    campaign: props.campaignId || 0,
    duplicate_check: false,
  },
})

const { setValue: setFile } = useField('file')

function handleFileUpdate(files: File[]) {
  file.value = files[0]
  setFile(files)
}

const loading = ref(false)

const onSubmit = handleSubmit((values) => {
  loading.value = true
  const formData = new FormData()
  formData.append('title', values.title)
  formData.append('file', file.value as File) // Append the first file from the array
  if (values.campaign) {
    formData.append('campaign', values.campaign.toString())
  }
  formData.append('duplicate_check', values.duplicate_check ? '1' : '0')
  formData.append('id', user.value?.id?.toString() ?? '')

  // emits('complete', { campaign_id: '20', list_id: '46' })
  // closeDialog()
  // return
  useApi().post('/add-list-api', formData).then((response) => {
    if (response.success === 'true') {
      showToast({
        message: response.message,
        type: 'success',
      })
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
    emits('complete', { campaign_id: values.campaign?.toString() ?? '', list_id: response?.list_id.toString(), list: values.title })
    closeDialog()
  }).catch((error) => {
    showToast({
      type: 'error',
      message: error.message,
    })
    handleFieldErrors({ errors: error.data }, setFieldError as any)
  }).finally(() => {
    loading.value = false
  })
})
function closeDialog() {
  showDialog.value = false
}

// function nextStep() {
//   closeDialog()
//   showConfigureDialog.value = true
// }
function onModelOpen(val: boolean) {
  if (val) {
    refreshCampaigns()
  }
  resetForm()
}
</script>

<template>
  <Dialog v-model:open="showDialog" @update:open="onModelOpen">
    <DialogTrigger as-child>
      <Button class="h-11">
        <Icon class="!text-white" name="material-symbols:add" size="20" />
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
      <DialogClose
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity
         hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
         disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
      <form @submit.prevent="onSubmit">
        <div class="space-y-4">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input ref="focusInput" type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Enter title" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="file">
            <FormItem>
              <FormLabel>File Upload</FormLabel>
              <FormControl>
                <BaseFileUploader accept=".xlc,.xlsx,.csv,.xls" max-size="5MB" @update:files="handleFileUpdate" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField, errorMessage }" name="campaign">
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger :disabled="campaignsStatus === 'pending'" class="w-full !h-11" :class="errorMessage && 'border-red-500'">
                    <SelectValue placeholder="Select campaign" class="text-xs md:text-sm" />
                  </SelectTrigger>
                  <SelectContent class="w-full">
                    <SelectItem v-for="option in campaigns" :key="option.id" :value="option.id">
                      {{ option.title }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ handleChange, value }" name="duplicate_check">
            <FormItem>
              <div class="flex items-center justify-between w-full">
                <FormLabel for="checkDuplicate" class="mb-0">
                  Check for duplicates
                </FormLabel>
                <FormControl>
                  <Checkbox
                    id="checkDuplicate"
                    :model-value="value" class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    @update:model-value="handleChange"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter class="flex flex-row justify-between items-center mt-6">
          <Button type="button" variant="outline" class="w-[49%] h-11 border-red-500 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600" @click="closeDialog">
            <Icon name="lucide:x" class="w-4 h-4 mr-1" />
            Discard
          </Button>
          <Button :loading="loading" :disabled="loading" type="button" class="w-[49%] h-11" @click="onSubmit">
            <Icon name="lucide:check" class="w-4 h-4 mr-1" />
            Next
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
