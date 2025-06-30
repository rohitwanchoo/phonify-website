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

const dialogOpen = ref(false)

// Define status options for dropdown
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

// Define primary options for dropdown
const primaryOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

// Validation schema
const formSchema = toTypedSchema(
  z.object({
    ip: z.string().min(1, 'IP is required').ip('Please enter a valid IP address'),
    label: z.string().min(1, 'Label is required').max(50),
    status: z.string().min(1, 'Status is required'),
    isPrimary: z.string().min(1, 'Primary status is required'),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    ip: '',
    label: '',
    status: '',
    isPrimary: '',
  },
})

const onSubmit = handleSubmit((values) => {
  // Prepare data for submission
  const formData = {
    ip: values.ip,
    label: values.label,
    status: values.status === 'active',
    isPrimary: values.isPrimary === 'true',
  }

  console.log('Form submitted:', formData)
  // TODO: Add your submission logic here
  dialogOpen.value = false
})

function handleClose() {
  resetForm()
  dialogOpen.value = false
}

function openDialog() {
  dialogOpen.value = true
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
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add VoIP Configuration</DialogTitle>
        </DialogHeader>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="py-4 space-y-4">
            <!-- IP Address Field -->
            <FormField v-slot="{ componentField }" name="ip">
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
            <FormField v-slot="{ componentField }" name="isPrimary">
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
              class="w-[50%] h-10"
              variant="outline"
              type="button"
              @click="handleClose"
            >
              <Icon name="material-symbols:close" />
              Close
            </Button>
            <Button class="w-[50%] h-10" type="submit">
              <Icon name="material-symbols:save" />
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
