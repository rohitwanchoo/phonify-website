<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,

} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Props {
  data?: any
}
const props = defineProps<Props>()

const emits = defineEmits(['complete'])

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'required').max(50),
  d_type: z.string().min(1, 'required'),
  enable_sms: z.number().min(1, 'required'),
}))

const initialValues = ref({
  title: '',
  d_type: '',
  enable_sms: undefined,
})

const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: initialValues.value,
})

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const isEdit = computed(() => props.data?.id || 0)
const loading = ref(false)

const enableSmsOptions = [
  {
    label: 'Yes',
    value: 1,
  },
  {
    label: 'No',
    value: 0,
  },
]

const dispositionType = [
  {
    label: 'Status',
    value: '1',
  },
  {
    label: 'Do Not Call',
    value: '2',
  },
  {
    label: 'Callback',
    value: '3',
  },
  {
    label: 'Call',
    value: 'call',
  },
]

const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  try {
    let api = '/add-disposition'
    if (isEdit.value)
      api = '/edit-disposition'

    const response = await useApi().post(api, values)
    loading.value = false
    resetForm()
    showToast({
      message: response.message,
      type: 'success',
    })
    emits('complete')
    open.value = false
  }
  catch (error) {
    showToast({
      message: `${error}`,
      type: 'error',
    })
  }
})

watch(() => open.value, (val) => {
  if (val && isEdit.value) {
    // set common fields
    setFieldValue('title', props.data.title)
    setFieldValue('d_type', props.data.d_type)
    setFieldValue('enable_sms', props.data.enable_sms)
  }
})

function onModelOpen(val: boolean) {
  if (!val) {
    resetForm()
  }
}
</script>

<template>
  <!-- reset form when dialog close -->
  <Dialog v-model:open="open" @update:open="onModelOpen">
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="!text-white" size="20" name="material-symbols:add" />
          Add Disposition
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[715px] max-h-screen overflow-y-auto [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex items-center justify-between">
          {{ isEdit ? 'Edit Disposition' : 'Add Disposition' }}
          <DialogClose class="cursor-pointer">
            <Icon name="material-symbols:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField
            v-slot="{ componentField }"
            name="title"
          >
            <FormItem>
              <FormLabel class="text-sm font-normal">
                Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter Dispoition Name" v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <!-- Disposition Type -->
          <FormField
            v-slot="{ componentField }"
            name="d_type"
          >
            <FormItem>
              <FormLabel class="text-sm font-normal">
                Type
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select Extension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="(option, index) in dispositionType" :key="index" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ componentField }"
            name="enable_sms"
          >
            <FormItem>
              <FormLabel class="text-sm font-normal">
                Enable SMS Popup
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select Options" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="(option, index) in enableSmsOptions" :key="index" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>

          <DialogFooter>
            <DialogClose class="w-full sm:w-1/2">
              <Button variant="outline" class="h-11  w-full">
                <Icon name="material-symbols:close" size="20" />
                Close
              </Button>
            </DialogClose>
            <Button for="form" :disabled="loading" :loading="loading" class="h-11 w-full sm:w-1/2" type="submit" @click="onSubmit">
              <Icon v-if="!loading" name="material-symbols:save" size="20" />
              Save
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
