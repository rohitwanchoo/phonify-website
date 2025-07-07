<!-- components/EditDialog.vue -->
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  refresh: () => void
}>()

const open = ref(false)

// Fetch field label options from API

const { data: fieldLabelList } = await useLazyAsyncData('field-label-list', async () => {
  const response = await useApi().get('/custom-field-labels', {})
  return response
})

// Map API data to dropdown options using the 'title' field
const fieldLabelOptions = computed(() =>
  ((fieldLabelList.value?.data || []) as any[]).map((item: any) => ({
    label: item.title,
    value: item.title,
  })),
)

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    fieldLabel: z.string().min(1, 'Field label is required'),
    link: z.string().min(1, 'Link is required').url('Please enter a valid URL'),
  }),
)

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
})

// Use useField for fieldLabel to get value and error
const { value: fieldLabelValue, errorMessage: fieldLabelError, handleChange: handleFieldLabelChange } = useField('fieldLabel')

// Add API call on submit
const onSubmit = handleSubmit(async (values) => {
  const res = await useLazyAsyncData('custom-field-add', async () => {
    const response = await useApi().put('custom-field-labels-value', {
      title_match: values.fieldLabel,
      title_links: values.link,
    })
    return response
  })
  // Show toast for both success and failure
  showToast({
    message: res.data.value?.message || (res.data.value?.success ? 'Saved successfully.' : 'Failed to save.'),
    type: res.data.value?.success ? 'success' : 'error',
  })
  // Only close the dialog if success
  if (res.data.value?.success) {
    open.value = false
    props.refresh() // Call refresh after successful submit
  }
})

function onOpenChange(isOpen: boolean) {
  if (!isOpen) {
    resetForm()
  }
  open.value = isOpen
}
</script>

<template>
  <div>
    <!-- Dialog Trigger Button -->
    <Button @click="open = true">
      <Icon class="!text-white" name="lucide:plus" />
      Add Custom Field Value
    </Button>

    <!-- Dialog Content -->
    <Dialog :open="open" @update:open="onOpenChange">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Value</DialogTitle>
        </DialogHeader>
        <Separator />

        <form class="space-y-4 mt-4" @submit.prevent="onSubmit">
          <!-- Field Label Dropdown -->
          <FormField v-slot="{ componentField }" name="fieldLabel">
            <FormItem>
              <FormLabel>Custom Field Label</FormLabel>
              <Select v-model="fieldLabelValue">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a field label" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="label in fieldLabelOptions"
                    :key="label.value"
                    :value="label.value"
                  >
                    {{ label.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage>{{ fieldLabelError }}</FormMessage>
            </FormItem>
          </FormField>

          <!-- Link Input -->
          <FormField v-slot="{ componentField }" name="link">
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter title Link"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <DialogFooter class="w-full mt-4 flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" class="flex-1 h-11" as-child>
              <DialogClose @click="resetForm">
                <Icon name="material-symbols:close" size="20" />
                Close
              </DialogClose>
            </Button>
            <Button type="submit" class="flex-1 h-11" :disabled="isSubmitting">
              <Icon name="material-symbols:save" size="20" />
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
