<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const dialogOpen = ref(false)
const optionsOpen = ref(false)
const loading = ref(false)

function onDialogOpen(val: boolean) {
  if (val) resetForm()
}

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Campaign name is required').max(100),
  campaign: z.string().min(1, 'Phone numbers are required'),
  file: z.instanceof(File, { message: 'File is required' })
    .refine(file => file.size <= 5 * 1024 * 1024, 'Max file size is 5MB')
    .refine(file => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      return ['xlsx', 'xls', 'csv'].includes(ext || '')
    }, 'Only Excel/CSV files allowed')
}))

const { handleSubmit, resetForm, setFieldValue, validateField } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    campaign: '',
    file: null as File | null
  },
})

async function handleFileUpdate(files: File[]) {
  if (files.length > 0) {
    setFieldValue('file', files[0])
    await validateField('file')
  } else {
    setFieldValue('file', null)
    await validateField('file')
  }
}

const onSubmit = handleSubmit((values) => {
  loading.value = true
  console.log('Form submitted with values:', {
    title: values.title,
    campaign: values.campaign,
    fileName: values.file?.name,
    fileSize: values.file?.size
  })
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    dialogOpen.value = false
    optionsOpen.value = true
    resetForm()
  }, 1000)
})
</script>

<template>
  <Dialog v-model:open="dialogOpen" @update:open="onDialogOpen">
    <DialogTrigger as-child>
      <Button>
        <Icon class="!text-white" name="lucide:plus" />
        Create Ringless Campaign
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Ringless List</DialogTitle>
      </DialogHeader>
      <form class="space-y-4 py-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <p class="text-primary text-sm">Title</p>
            <FormControl>
              <Input 
                placeholder="Enter campaign name" 
                class="h-11" 
                v-bind="componentField" 
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="file">
          <FormItem>
            <p class="text-primary text-sm">Upload File</p>
            <FormControl>
              <BaseFileUploader
                v-bind="componentField"
                accept=".xlsx,.xls,.csv"
                max-size="5MB"
                @update:files="handleFileUpdate"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="campaign">
          <FormItem>
            <p class="text-primary text-sm">Campaign</p>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="h-11 w-full">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="summer-sale">Summer Sale Promotion</SelectItem>
                    <SelectItem value="new-product">New Product Launch</SelectItem>
                    <SelectItem value="holiday-special">Holiday Special Offer</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <DialogFooter class="pt-4">
          <Button 
            type="button" 
            variant="outline" 
            class="w-[50%] border-red-500 text-red-500 bg-red-50 hover:bg-white hover:text-red-500" 
            @click="resetForm"
          >
            <Icon name="material-symbols:close" />
            Discard
          </Button>
          <Button 
            type="submit" 
            class="w-[50%]" 
            :disabled="loading"
          >
            <Icon name="material-symbols:check" />
            {{ loading ? 'Submitting...' : 'Next' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
  <RinglessVoicemailListsOptions 
    v-model:open="optionsOpen" 
    :title="'hello'" 
    :campaign="'hi'" 
  />
</template>