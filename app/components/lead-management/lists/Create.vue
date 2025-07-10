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

const { data: campaigns, refresh: refreshCampaigns } = await useLazyAsyncData('create-list-campaign', () =>
  useApi().post('/campaign'), {
  transform: res => res.data,
  immediate: false,
})

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  file: z.array(z.instanceof(File)).min(1, 'File is required'),
  campaign_id: z.number().min(1, 'Campaign is required'),
  checkDuplicates: z.boolean().optional(),
})

const { handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(formSchema),

})

const { setValue: setFile } = useField('file')

function handleFileUpdate(files: File[]) {
  setFile(files)
}

const loading = ref(false)

const onSubmit = handleSubmit((values) => {
  console.log(values)
  loading.value = true
  const formData = new FormData()
  formData.append('title', values.title)
  formData.append('file', values.file) // Append the first file from the array
  formData.append('campaign', values.campaign_id.toString())
  formData.append('checkDuplicates', JSON.stringify(values.checkDuplicates))
  useApi().post('/add-list', formData).then((response) => {
    showToast({
      message: response.message,
    })
  }).catch((error) => {
    showToast({
      type: 'error',
      message: error.message,
    })
  }).finally(() => {
    loading.value = false
  })
})
function closeDialog() {
  showDialog.value = false
}

function onNext() {
  closeDialog()
  showConfigureDialog.value = true
}
function onModelOpen(val: boolean) {
  if (val)
    refreshCampaigns()
}
</script>

<template>
  <Dialog v-model:open="showDialog" @update:open="onModelOpen">
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
      <form @submit.prevent="onSubmit">
        <div class="space-y-4">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Enter title" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="file">
            <FormItem>
              <FormLabel>File Upload</FormLabel>
              <FormControl>
                <BaseFileUploader accept=".xlc,.xlxs,.csv" max-size="5MB" @update:files="handleFileUpdate" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField, errorMessage }" name="campaign_id">
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11" :class="errorMessage && 'border-red-500'">
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
          <FormField v-slot="{ handleChange, value }" name="checkDuplicates">
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
          <Button type="button" variant="outline" class="w-[49%] border-red-500 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600" @click="closeDialog">
            <Icon name="lucide:x" class="w-4 h-4 mr-1" />
            Discard
          </Button>
          <Button :loading type="button" class="w-[49%]" @click="onSubmit">
            <Icon name="lucide:check" class="w-4 h-4 mr-1" />
            Next
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  <!-- <ConfigureListDialog :open="showConfigureDialog" @update:open="val => { showConfigureDialog = val; if (!val) closeConfigureDialog() }" /> -->
</template>
