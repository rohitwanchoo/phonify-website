<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const route = useRoute()
const router = useRouter()
const isAddMode = computed(() => !route.params.id && !route.query.id)

const breadcrumbs = [
  {
    label: 'API List',
    href: '/app/configuration/api',
  },
  {
    label: isAddMode.value ? 'Add API List' : 'Edit API List',
    href: '/app/configuration/api/api-list',
  },
]

// Use dispositionList from API
const { data: dispositionList } = await useLazyAsyncData('get-disposition-list', () =>
  useApi().post('/disposition', {}), {
  transform: res => res.data,
})

// Use campaignList from API
const { data: campaignsList } = await useLazyAsyncData('campaign-list', () =>
  useApi().post('/campaign', {}), {
  transform: res => res.data,
})

const { data: crmLabelsList } = await useLazyAsyncData('crm-labels', () =>
  useApi().get('/crm-labels', {
  }), {
  transform: res => res.data,
})

// Use computed for available options based on API data
const selectedDispositions = ref<number[]>([])
const availableDispositionOptions = computed(() =>
  (dispositionList.value || []).filter(opt => !selectedDispositions.value.includes(opt.id)),
)

// Form Schema (align field names with API)
const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Name is required'),
  url: z.string().min(1, 'URL is required'),
  method: z.string().min(1, 'Method is required'),
  campaign_id: z.number().min(1, 'Campaign is required'),
  disposition: z.array(z.number()).min(1, 'At least one disposition is required'),
  is_default: z.boolean(),
  parameter: z.array(z.object({
    parameter: z.string().min(1, 'API Name is required'),
    type: z.string().min(1, 'API Type is required'),
    value: z.string().optional(),
  })).optional(),
}))

// Form initialization (align initialValues)
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    url: '',
    method: 'GET',
    campaign_id: 0,
    disposition: [],
    is_default: false,
    parameter: [],
  },
})

// Sync selected dispositions with form values
watch(selectedDispositions, (newVal) => {
  setFieldValue('disposition', newVal)
}, { deep: true })

// Sync campaign selection to campaign_id
function handleCampaignChange(selectedTitle: string) {
  const campaign = (campaignsList?.value || []).find(c => c.title === selectedTitle)
  setFieldValue('campaign_id', campaign ? campaign.id : 0)
}

// Get the parameter field
const { value: parameter } = useField('parameter')

// API Type options (now from crmLabelsList)
const apiTypeOptions = computed(() =>
  (crmLabelsList.value || []).map(label => ({
    label: label.title,
    value: label.title,
  })),
)

// Method options for dropdown
const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
]

// Parameters table state
const showAddDialog = ref(false)

// Add parameter rows
function handleAddParameter({ type, rows }: { type: string, rows: number }) {
  for (let i = 0; i < rows; i++) {
    parameter.value.push({
      parameter: '',
      type: '',
      value: '',
      dataFieldType: type === 'parameter_constant' ? 'textbox' : 'dropdown',
    })
  }
  showAddDialog.value = false
  showToast({ type: 'success', message: `${rows} row(s) added successfully.` })
}

// Form submission (use form values directly)
const onSubmit = handleSubmit(async (values) => {
  // Convert is_default boolean to 1/0 as per API
  const payload = {
    ...values,
    is_default: values.is_default ? 1 : 0,
    parameter: (values.parameter || []).map(param => ({
      type: 'query',
      parameter: param.parameter,
      value: param.value || '',
    })),
  }
  try {
    const res = await useApi().post('/add-api', payload)
    if (res.success) {
      showToast({
        message: res.message,
      })
      resetForm()
      selectedDispositions.value = []
      router.push('/app/configuration/api') // Redirect after success
    }
  }
  catch (err: any) {
    showToast({
      type: 'error',
      message: err.message,
    })
  }
})

// Add disposition to selected list
function addDisposition(id: number) {
  if (!selectedDispositions.value.includes(id)) {
    selectedDispositions.value = [...selectedDispositions.value, id]
  }
}

// Remove disposition from selected list
function removeDisposition(id: number) {
  selectedDispositions.value = selectedDispositions.value.filter(d => d !== id)
}

// Parameter management
function removeParameter(idx: number) {
  parameter.value.splice(idx, 1)
}

// Wrap resetForm to also clear selectedDispositions
function handleResetForm() {
  resetForm()
  selectedDispositions.value = []
}

function addParameter() {
  showAddDialog.value = true
}

function closeAddDialog() {
  showAddDialog.value = false
}

function handleSaved(newParameter: any) {
  parameter.value.push({
    ...newParameter,
  })
  closeAddDialog()
}
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-110px)] overflow-auto ">
    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto">
      <BaseHeader :title="isAddMode ? 'Add API List' : 'Edit API List'" :breadcrumbs="breadcrumbs" />

      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4">
          <!-- API Information Section -->
          <div class="lg:col-span-12">
            <div class="border rounded-xl p-4 bg-white">
              <!-- Header -->
              <div class="flex items-center justify-between mb-2">
                <h2 class="text-lg">
                  API Information
                </h2>
                <Button class="h-8 md:h-11 px-2 md:px-4" type="button" @click="handleResetForm">
                  <Icon name="material-symbols:refresh" class="text-base text-white" />
                  Reset
                </Button>
              </div>

              <div class="-mx-4 border-b border-gray-200 mb-4" />

              <!-- Form Fields Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Name -->
                <FormField v-slot="{ componentField }" name="title">
                  <FormItem class="flex flex-col gap-1 w-full">
                    <FormLabel class="font-medium text-gray-700">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input class="py-5" v-bind="componentField" placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- URL -->
                <FormField v-slot="{ componentField }" name="url">
                  <FormItem class="flex flex-col gap-1 w-full">
                    <FormLabel class="font-medium text-gray-700">
                      URL
                    </FormLabel>
                    <FormControl>
                      <Input class="py-5" v-bind="componentField" placeholder="Enter URL" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- Method -->
                <FormField v-slot="{ componentField }" name="method">
                  <FormItem class="flex flex-col gap-1 w-full ">
                    <FormLabel class="font-medium text-gray-700">
                      Method
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger class="w-full py-5">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="option in methodOptions"
                            :key="option.value"
                            :value="option.value"
                          >
                            {{ option.label }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- Campaign -->
                <FormField v-slot="{ componentField }" name="campaign_id">
                  <FormItem class="flex flex-col gap-1 w-full">
                    <FormLabel class="font-medium text-gray-700">
                      Campaign
                    </FormLabel>
                    <FormControl>
                      <Select
                        :model-value="(campaignsList?.value || []).find(c => c.id === componentField.value)?.title"
                        @update:model-value="handleCampaignChange"
                      >
                        <SelectTrigger class="w-full py-5">
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="item in campaignsList || []"
                            :key="item.id"
                            :value="item.title"
                          >
                            {{ item.title }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- Disposition -->
                <FormField name="disposition">
                  <FormItem class="flex flex-col gap-1 md:col-span-2">
                    <FormLabel class="font-medium text-gray-700">
                      Disposition
                    </FormLabel>
                    <FormControl>
                      <div class="relative">
                        <Select @update:model-value="addDisposition">
                          <SelectTrigger class="w-full flex items-start relative !min-h-10 py-2 !h-auto">
                            <span v-if="!selectedDispositions.length" class="text-muted-foreground">Select disposition</span>
                            <div
                              v-if="selectedDispositions.length"
                              class="flex flex-wrap gap-1 items-center w-full pointer-events-auto"
                              style="min-height: 1.5rem;"
                            >
                              <div
                                v-for="id in selectedDispositions"
                                :key="id"
                                class="flex items-center rounded-[6px] border border-[#00A086] bg-[#00A0861A] px-2 py-1 text-xs h-7 flex-shrink-0"
                              >
                                {{ (dispositionList || []).find(opt => opt.id === id)?.title || id }}
                                <Button
                                  variant="outline"
                                  class="ml-1 p-0 h-fit bg-accent"
                                  @click.stop="removeDisposition(id)"
                                >
                                  <Icon name="material-symbols:close" size="12" />
                                </Button>
                              </div>
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              v-for="option in availableDispositionOptions"
                              :key="option.id"
                              :value="option.id"
                            >
                              {{ option.title }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <!-- API Template Toggle (Full width) -->
                <div class="md:col-span-2">
                  <div class="bg-[#00A0860D] p-4 rounded-lg">
                    <FormField v-slot="{ value, handleChange }" name="is_default">
                      <FormItem class="flex items-center justify-between text-sm">
                        <FormLabel class="font-medium text-gray-700">
                          Set API Template
                        </FormLabel>
                        <FormControl>
                          <Switch
                            :model-value="value"
                            class="data-[state=checked]:bg-green-600"
                            @update:model-value="handleChange"
                          />
                        </FormControl>
                      </FormItem>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Parameters Section -->
          <div class="lg:col-span-12 ">
            <div class="border rounded-xl bg-white">
              <div class="flex items-center justify-between px-4 pt-4">
                <h2 class="text-lg font-normal">
                  Parameters
                </h2>
                <Button
                  class="bg-primary text-white h-8 md:h-11 px-2 md:px-4 flex items-center gap-1"
                  type="button"
                  @click="addParameter"
                >
                  <Icon class="!text-white" name="lucide:plus" />
                  Add Parameter
                </Button>
              </div>
              <div class="my-2 overflow-hidden">
                <Table v-if="parameter.length > 0">
                  <TableHeader>
                    <TableRow>
                      <TableHead class="bg-gray-50 text-center w-10 text-sm font-normal text-gray-500">
                        #
                      </TableHead>
                      <TableHead class="bg-gray-50 py-4">
                        <div class="inline-flex items-center justify-center gap-0.5 w-full text-sm font-normal text-gray-500">
                          Parameter
                          <Icon name="lucide:chevrons-up-down" class="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead class="bg-gray-50">
                        <div class="inline-flex items-center justify-center gap-0.5 w-full text-sm font-normal text-gray-500">
                          Data
                          <Icon name="lucide:chevrons-up-down" class="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead class="bg-gray-50 text-center w-20 text-sm font-normal text-gray-500">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="(row, idx) in parameter" :key="idx">
                      <TableCell class="text-center">
                        {{ idx + 1 }}
                      </TableCell>
                      <TableCell class="p-3">
                        <Input
                          v-model="row.parameter"
                          class="h-9 py-5 w-50 md:w-full"
                          placeholder="parameter #"
                        />
                      </TableCell>
                      <TableCell>
                        <!-- Render textbox or dropdown based on dataFieldType -->
                        <template v-if="row.dataFieldType === 'textbox'">
                          <Input
                            v-model="row.type"
                            class="h-9 py-5 w-50 md:w-full"
                            placeholder="Enter value"
                          />
                        </template>
                        <template v-else>
                          <Select v-model="row.type">
                            <SelectTrigger class="h-9 w-50 md:w-full py-5">
                              <SelectValue placeholder="Select label" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem v-for="opt in apiTypeOptions" :key="opt.value" :value="opt.value">
                                {{ opt.label }}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </template>
                      </TableCell>
                      <TableCell class="text-center">
                        <Button
                          size="icon"
                          variant="outline"
                          class="border-red-600 text-red-600 hover:text-red-600/80 flex items-center gap-1 px-2 py-5 w-21"
                          @click="removeParameter(idx)"
                        >
                          <Icon name="material-symbols:delete" />
                          <span class="text-xs font-normal">Remove</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div v-else class="text-center text-gray-400 py-8">
                  No parameters selected.
                </div>
              </div>
              <ConfigurationAPIAddParameter
                :open="showAddDialog"
                @close="closeAddDialog"
                @add-parameter="handleAddParameter"
              />
            </div>
          </div>
        </div>

        <!-- Sticky footer button -->
        <div
          class="sticky bottom-0 bg-white w-full flex justify-end items-center gap-4 p-4 border-t border-gray-200 z-10"
        >
          <Button
            type="submit"
            class="px-8 py-3 h-12 w-full"
          >
            <Icon name="material-symbols:check" size="20" />
            Submit
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
