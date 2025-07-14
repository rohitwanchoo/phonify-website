<!-- components/CustomFieldDialog.vue -->
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
  // Optional prop for edit mode
  rowData: {
    type: Object,
    default: null,
  },
  refresh: {
    type: Function,
    required: true,
  },
})

const emits = defineEmits(['update:open'])

// Computed property to determine if we're in edit mode
const isEditMode = computed(() => Boolean(props.rowData?.id))

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

const { handleSubmit, resetForm, isSubmitting, setValues } = useForm({
  validationSchema: formSchema,
})

// Initialize form with empty values
resetForm({
  values: {
    fieldLabel: '',
    link: '',
  },
})

// Populate form when dialog opens or rowData changes
watch(() => props.open, (isOpen) => {
  if (isOpen && isEditMode.value) {
    // Edit mode - populate with rowData
    setValues({
      fieldLabel: props.rowData.title_match,
      link: props.rowData.title_links,
    })
  }
  else {
    // Add mode - reset form
    resetForm({
      values: {
        fieldLabel: '',
        link: '',
      },
    })
  }
}, { immediate: true })

// Handle form submission
const onSubmit = handleSubmit(async (values) => {
  try {
    let res
    if (isEditMode.value) {
      // Edit API call
      res = await useLazyAsyncData('custom-field-edit', async () => {
        return await useApi().post(`/custom-field-value/${props.rowData.id}`, {
          title_match: values.fieldLabel,
          title_links: values.link,
        })
      })
    }
    else {
      // Add API call
      res = await useLazyAsyncData('custom-field-add', async () => {
        return await useApi().put('custom-field-labels-value', {
          title_match: values.fieldLabel,
          title_links: values.link,
        })
      })
    }

    showToast({
      message: res.data.value?.message
        || (res.data.value?.success
          ? (isEditMode.value ? 'Updated successfully' : 'Saved successfully')
          : (isEditMode.value ? 'Update failed' : 'Failed to save')),
      type: res.data.value?.success ? 'success' : 'error',
    })

    if (res.data.value?.success) {
      emits('update:open', false)
      props.refresh()
    }
  }
  catch (error) {
    showToast({
      message: `An error occurred while ${isEditMode.value ? 'updating' : 'saving'}`,
      type: 'error',
    })
  }
})

function onOpenChange(open: boolean) {
  emits('update:open', open)
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? 'Edit Custom Field Value' : 'Add Custom Field Value' }}
        </DialogTitle>
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
            <DialogClose>
              <Icon name="material-symbols:close" size="20" />
              Cancel
            </DialogClose>
          </Button>
          <Button type="submit" class="flex-1 h-11" :disabled="isSubmitting">
            <Icon name="material-symbols:save" size="20" />
            {{ isEditMode ? 'Update' : 'Save' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
