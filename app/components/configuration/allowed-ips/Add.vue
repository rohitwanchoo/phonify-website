<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

const open = ref(false)

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

// Validation schema
const formSchema = toTypedSchema(
  z.object({
    ip_address: z.string().min(1, 'IP is required').ip('Please enter a valid IP address'),
    label: z.string().min(1, 'Label is required').max(50),
    status: z.string().min(1, 'Status is required'),
    is_primary: z.string().min(1, 'Primary status is required'),
  }),
)

const { handleSubmit, resetForm, setFieldError } = useForm({
  validationSchema: formSchema,
  initialValues: {
    ip_address: '',
    label: '',
    status: '',
    is_primary: '',
  },
})

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    ip_address: values.ip_address,
    label: values.label,
    status: values.status,
    is_primary: values.is_primary,
  }

  try {
    loading.value = true
    const response = await useApi().put('/allowed-ip', {
      ...payload,
    })
    showToast({
      message: response.message,
      type: response.success ? 'success' : 'error',
    })
    resetForm()
    open.value = false
    refreshNuxtData('allowed-ips')
  }
  catch (error: any) {
    handleFieldErrors(error?.data, setFieldError)
    showToast({
      message: `${error?.message}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})

function handleClose() {
  resetForm()
  open.value = false
}

function openDialog() {
  open.value = true
}
</script>

<template>
  <div>
    <!-- Trigger Button -->
    <Button @click="openDialog">
      <Icon class="!text-white" name="lucide:plus" />
      Add IPs
    </Button>

    <!-- Dialog -->
    <Dialog v-model:open="open">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add VoIP Configuration</DialogTitle>
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
                    placeholder="Enter IP address"
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
                    placeholder="Enter label"
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
                      <SelectValue placeholder="Select primary" />
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

          <DialogFooter>
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
  </div>
</template>
