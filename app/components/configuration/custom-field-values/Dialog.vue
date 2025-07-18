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
const emit = defineEmits(['update:open'])
// Computed property to determine if we're in edit mode
const isEditMode = computed(() => Boolean(props.rowData?.id))

const { data: fieldLabelList, refresh: refreshLabels } = await useLazyAsyncData('field-label-list', () =>
  useApi().get('/custom-field-labels', {
  }), {
  transform: (res) => {
    return res.data
  },
  immediate: false,
})

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
      res = await useApi().post(`/custom-field-value/${props.rowData.id}`, {
        title_match: values.fieldLabel,
        title_links: values.link,
      })
    }
    else {
      // Add API call
      res = await useApi().put('custom-field-labels-value', {
        title_match: values.fieldLabel,
        title_links: values.link,
      })
    }

    showToast({
      message: res?.message
        || (res?.success
          ? (isEditMode.value ? 'Updated successfully' : 'Saved successfully')
          : (isEditMode.value ? 'Update failed' : 'Failed to save')),
      type: res.success ? 'success' : 'error',
    })

    if (res?.success) {
      emits('update:open', false)
      props.refresh()
    }
  }
  catch (error: any) {
    showToast({
      message: error?.message,
      type: 'error',
    })
  }
})
const open = defineModel('open', { type: Boolean, default: false })
watch(open, (val) => {
  if (val) {
    refreshLabels()
  }
})

function onOpenChange(value: boolean) {
  emit('update:open', value)
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
                <SelectTrigger class="w-full !h-11">
                  <SelectValue placeholder="Select field label" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="label in fieldLabelList"
                  :key="label.id"
                  :value="label.title"
                >
                  {{ label.title }}
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
                class="h-11"
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
            <template v-if="isSubmitting">
              <Icon name="lucide:ring-resize" size="20" class="mr-2" />
              {{ isEditMode ? 'Updating...' : 'Saving...' }}
            </template>
            <template v-else>
              <Icon name="material-symbols:save" size="20" class="mr-2" />
              {{ isEditMode ? 'Update' : 'Save' }}
            </template>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
