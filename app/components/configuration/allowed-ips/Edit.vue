<script setup lang="ts">
import { Icon } from '#components'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const props = defineProps<{
  open: boolean
  selectedId: number
}>()

const emit = defineEmits(['update:open'])

const dialogOpen = computed({
  get: () => props.open,
  set: val => emit('update:open', val),
})

// Define status options for dropdown
const statusOptions = [
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' },
]

// Define primary options for dropdown
const primaryOptions = [
  { value: '1', label: 'Yes' },
  { value: '0', label: 'No' },
]

const { data: allowedIp, refresh: allowedIpRefresh } = await useLazyAsyncData('allowed-ip', () =>
  useApi().get(`/allowed-ip/${props.selectedId}`), {
  transform: res => res.data,
  immediate: false,
})

const { handleSubmit, resetForm, setFieldValue } = useForm({
  initialValues: {
    ip_address: allowedIp?.value?.ip_address || '',
    label: allowedIp?.value?.label || '',
    status: allowedIp?.value?.status || '',
    is_primary: allowedIp?.value?.is_primary || '',
  },
})

// Watch for row changes and update form
watch(dialogOpen, async (newVal) => {
  if (newVal) {
    await Promise.all([
      allowedIpRefresh(),
    ])
    // Set initial values
    if (allowedIp.value) {
      setFieldValue('ip_address', allowedIp?.value?.ip_address || '')
      setFieldValue('label', allowedIp?.value?.label || '')
      setFieldValue('status', allowedIp?.value?.status || '')
      setFieldValue('is_primary', allowedIp?.value?.is_primary || '')
      resetForm({
        values: {
          ip_address: allowedIp?.value?.ip_address || '',
          label: allowedIp?.value?.label || '',
          status: allowedIp?.value?.status || '',
          is_primary: allowedIp?.value?.is_primary || '',
        },
      })
    }
  }
})

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  // Prepare data for submission
  const formData = {
    ip_address: values.ip_address,
    label: values.label,
    status: values.status,
    is_primary: values.is_primary,
  }

  try {
    loading.value = true

    const response = await useApi().post(`/allowed-ip/${allowedIp?.value?.id}`, {
      ...formData,
    })
    showToast({
      message: response.message,
      type: 'success',
    })
    handleClose()
    refreshNuxtData('allowed-ips')
  }
  catch (error: any) {
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})

function handleClose() {
  dialogOpen.value = false
}
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          VoIP Configuration
        </DialogTitle>
      </DialogHeader>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div class="py-4 space-y-4">
          <!-- IP Address Field -->
          <FormField v-slot="{ componentField }" name="ip_address">
            <FormItem>
              <FormLabel>IP Address</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter IP address (e.g., 192.168.1.1)"
                />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>

          <!-- Label Field -->
          <FormField v-slot="{ componentField }" name="label">
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter configuration label"
                />
              </FormControl>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>

          <!-- Status Dropdown -->
          <FormField v-slot="{ componentField }" name="status">
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="option in statusOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>

          <!-- Is Primary Dropdown -->
          <FormField v-slot="{ componentField }" name="is_primary">
            <FormItem>
              <FormLabel>Is Primary</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select primary status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="option in primaryOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage class="ml-2 text-xs" />
            </FormItem>
          </FormField>
        </div>

        <DialogFooter class="flex gap-2 items-center">
          <Button
            class="w-full md:w-[50%] h-10"
            variant="outline"
            type="button"
            @click="handleClose"
          >
            <Icon name="material-symbols:close" />
            Close
          </Button>
          <Button
            class="w-full md:w-[50%] h-10"
            type="submit"
            :loading="loading"
            :disabled="loading"
          >
            <Icon name="material-symbols:save" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
