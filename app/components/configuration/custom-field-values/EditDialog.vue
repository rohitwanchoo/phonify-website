<!-- components/EditDialog.vue -->
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
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

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  rowData: {
    type: Object,
    default: () => ({}),
  },
  refresh: {
    type: Function,
    required: true,
  },
})

const emits = defineEmits(['update:open'])

// Fetch field label options from API
const { data: fieldLabelList } = await useLazyAsyncData('field-label-list', async () => {
  const response = await useApi().get('/custom-field-labels', {})
  return response
})

// Map API data to dropdown options
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

const { handleSubmit, resetForm, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
})

// Pre-fill form when rowData changes
watch(() => props.rowData, (newVal) => {
  if (newVal?.id) {
    setFieldValue('fieldLabel', newVal.title_match)
    setFieldValue('link', newVal.title_links)
  }
}, { immediate: true })

// Submit handler for editing
const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await useLazyAsyncData('custom-field-edit', async () => {
      return await useApi().post(`/custom-field-value/${props.rowData.id}`, {
        title_match: values.fieldLabel,
        title_links: values.link,
        // Include any other required fields from your API
      })
    })

    showToast({
      message: res.data.value?.message
        || (res.data.value?.success ? 'Updated successfully' : 'Update failed'),
      type: res.data.value?.success ? 'success' : 'error',
    })

    if (res.data.value?.success) {
      emits('update:open', false)
      props.refresh() // Refresh parent table
    }
  }
  catch (error) {
    showToast({
      message: 'An error occurred while updating',
      type: 'error',
    })
  }
})

function onOpenChange(open: boolean) {
  if (!open) {
    resetForm()
  }
  emits('update:open', open)
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Custom Field Value</DialogTitle>
      </DialogHeader>
      <Separator />

      <form class="space-y-4 mt-4" @submit.prevent="onSubmit">
        <!-- Field Label Dropdown -->
        <FormField v-slot="{ componentField }" name="fieldLabel">
          <FormItem>
            <FormLabel>Field Label</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select field label" />
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
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Link Input -->
        <FormField v-slot="{ componentField }" name="link">
          <FormItem>
            <FormLabel>Link URL</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="https://example.com"
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
              Cancel
            </DialogClose>
          </Button>
          <Button type="submit" class="flex-1 h-11" :disabled="isSubmitting">
            <Icon name="material-symbols:save" size="20" />
            Update
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
