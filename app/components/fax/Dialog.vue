<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const dialogOpen = ref(false)
const optionsOpen = ref(false)
const loading = ref(false)
const formTitle = ref('')
const formCampaign = ref('')

function onDialogOpen(val: boolean) {
  if (val)
    resetForm()
}

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Campaign name is required').max(100),
  campaign: z.string().min(1, 'Phone numbers are required'),
  file: z.instanceof(File, { message: 'File is required' })
    .refine(file => file.size <= 10 * 1024 * 1024, 'Max file size is 10MB')
    .refine((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      return ['pdf'].includes(ext || '')
    }, 'Only PDF files allowed'),
}))

const { handleSubmit, resetForm, setFieldValue, validateField } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    campaign: '',
    file: null as File | null,
  },
})

async function handleFileUpdate(files?: File[]) {
  if (files?.length) {
    setFieldValue('file', files[0])
    await validateField('file')
  }
  else {
    setFieldValue('file', null)
    await validateField('file')
  }
}

const onSubmit = handleSubmit((values) => {
  loading.value = true
  formTitle.value = values.title
  formCampaign.value = values.campaign
  console.log('Form submitted with values:', {
    title: values.title,
    campaign: values.campaign,
    fileName: values.file?.name,
    fileSize: values.file?.size,
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
        <Icon class="!text-white" name="material-symbols:fax-outline-rounded" size="18" />
        Compose
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Send New Fax</DialogTitle>
      </DialogHeader>
      <form class="space-y-4 py-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="campaign">
          <FormItem>
            <p class="text-primary text-sm">
              Select the phone number you wish to send fax from
            </p>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="h-11 w-full">
                  <SelectValue placeholder="Select any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="+1 (333) 123-4567">
                      +1 (333) 123-4567
                    </SelectItem>
                    <SelectItem value="+1 (333) 123-8796">
                      +1 (333) 123-8796
                    </SelectItem>
                    <SelectItem value="+1 (333) 443-8123">
                      +1 (333) 443-8123
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <p class="text-primary text-sm">
              Recipient Fax Number
            </p>
            <FormControl>
              <Input
                v-maska
                data-maska="(###) ###-####" v-bind="componentField"
                placeholder="(___) ___-____"
                class="h-11"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="file">
          <FormItem>
            <FormControl>
              <BaseFileUploader
                v-bind="componentField"
                accept=".pdf"
                max-size="10MB"
                @update:files="handleFileUpdate"
              />
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
            {{ loading ? 'Submitting...' : 'Send' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
