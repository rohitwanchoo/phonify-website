<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as XLSX from 'xlsx'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const props = defineProps<{
  campaigns: { id: string, title: string }[]
  loadCampaigns: () => Promise<void>
}>()

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

// Local state
const dialogOpen = ref(false)
const loading = ref(false)
const fileHeaders = ref<string[]>([])
const formTitle = ref('')
const formCampaign = ref('')
const showConfigureDialog = ref(false)

const api = useApi()

// zod schema
const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'Campaign name is required').max(100),
    campaign: z.string().min(1, 'Campaign is required'),
    file: z
      .instanceof(File, { message: 'File is required' })
      .refine(file => file.size <= 5 * 1024 * 1024, 'Max file size is 5MB')
      .refine((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        return ['xlsx', 'xls', 'csv'].includes(ext || '')
      }, 'Only Excel/CSV files allowed'),
  }),
)

const { handleSubmit, resetForm, setFieldValue, validateField } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    campaign: '',
    file: null as File | null,
  },
})

async function onDialogOpen(val: boolean) {
  if (val) {
    resetForm()
    await props.loadCampaigns()
  }
}

// Handle file upload
async function handleFileUpdate(files: File[]) {
  const file = files[0]
  if (file) {
    setFieldValue('file', file)
    await validateField('file')

    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    if (json.length > 0) {
      const headers = json[0] as string[]
      fileHeaders.value = headers.filter(Boolean)
    }
    else {
      setFieldValue('file', null)
      fileHeaders.value = []
    }
  }
}

// Handle form submit
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('campaign_id', values.campaign)
    if (values.file) {
      formData.append('file', values.file)
    }

    await useApi().put('/ringless/list/add', formData)

    emit('refresh')
    formTitle.value = values.title
    formCampaign.value = values.campaign
    dialogOpen.value = false
    showConfigureDialog.value = true
    resetForm()
  }
  catch (error: any) {
    showToast({
      type: 'error',
      message: error.response?.data?.message || 'Failed to add list',
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <!-- Add Dialog -->
  <Dialog v-model:open="dialogOpen" @update:open="onDialogOpen">
    <DialogTrigger as-child>
      <Button class="h-11">
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
            <p class="text-primary text-sm">
              Title
            </p>
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
            <p class="text-primary text-sm">
              Upload File
            </p>
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
            <p class="text-primary text-sm">
              Campaign
            </p>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="h-11 w-full">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="campaign in props.campaigns"
                      :key="campaign.id"
                      :value="String(campaign.id)"
                    >
                      {{ campaign.title }}
                    </SelectItem>
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
          <Button type="submit" class="w-[50%]" :disabled="loading">
            <Icon name="material-symbols:check" />
            {{ loading ? 'Submitting...' : 'Next' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <!-- Configure Dialog -->
  <RinglessVoicemailListsConfigureDialog
    v-model:open="showConfigureDialog"
    :title="formTitle"
    :selected-campaign="formCampaign"
    :campaigns="props.campaigns"
    :headers="fileHeaders"
  />
</template>
