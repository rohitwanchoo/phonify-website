<script setup lang="ts">
import { useFetch } from '#app'
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { onMounted, ref } from 'vue'
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

interface Campaign {
  id: string
  title: string
}

const emits = defineEmits<{
  (e: 'refresh'): void
}>()

const api = useApi()

// -- FORM SCHEMA --
const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Campaign name is required').max(100),
  campaign: z.string().min(1, 'Campaign is required'),
  file: z.instanceof(File, { message: 'File is required' })
    .refine(file => file.size <= 5 * 1024 * 1024, 'Max file size is 5MB')
    .refine((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      return ['xlsx', 'xls', 'csv'].includes(ext || '')
    }, 'Only Excel/CSV files allowed'),
}))

const { handleSubmit, resetForm, setFieldValue, validateField } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    campaign: '',
    file: null as File | null,
  },
})

// -- STATE --
const dialogOpen = ref(false)
const optionsOpen = ref(false)
const loading = ref(false)
const formTitle = ref('')
const formCampaign = ref('')

// -- CAMPAIGNS FETCH --
const {
  data: campaigns,
  refresh: campaignRefresh,
} = await useLazyAsyncData('campaigns', () => api.get('/ringless/campaign'), {
  transform: res => res.data,
  immediate: false,
})

onMounted(() => {
  campaignRefresh()
})

// -- FILE HANDLER --
async function handleFileUpdate(files: File[]) {
  if (files.length > 0) {
    setFieldValue('file', files[0])
    await validateField('file')
  }
  else {
    setFieldValue('file', null)
    await validateField('file')
  }
}

// -- FORM SUBMIT --
const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  try {
    const payload = {
      title: values.title,
      campaign_id: Number.parseInt(values.campaign),
      file_name: values.file?.name || '',
    }

    await api.put('/ringless/list/add', payload)

    showToast({ message: 'List added successfully' })
    emits('refresh')

    // Set for configure dialog
    formTitle.value = values.title
    formCampaign.value = values.campaign

    dialogOpen.value = false
    optionsOpen.value = true
    resetForm()
  }
  catch (error: any) {
    showToast({ type: 'error', message: error.message || 'Failed to add list' })
  }
  finally {
    loading.value = false
  }
})

// -- RESET ON OPEN --
function onDialogOpen(val: boolean) {
  if (val)
    resetForm()
}
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
                      v-for="campaign in campaigns"
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
  <RinglessVoicemailListsConfigureDialog
    v-model:open="optionsOpen"
    :title="formTitle"
    :campaign="formCampaign"
  />
</template>
