<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const props = defineProps<{
  initialData: Record<string, any> | null
}>()

const open = defineModel<boolean>('open', { default: false })

const { user } = useAuth()

// Computed property to determine if we're in edit mode
const isEditMode = computed(() => Boolean(props.initialData?.id))

// field list options
const { data: fieldLabelList, status: fieldLabelListStatus, refresh: refreshLabels } = await useLazyAsyncData('field-label-list', () =>
  useApi().get('/custom-field-labels', {
  }), {
  transform: res => res.data,
  immediate: false,
})

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    fieldLabel: z.string().min(1, 'Field label is required'),
    link: z.string().min(1, 'Link is required').url('Please enter a valid URL'),
  }),
)

// Form Setup
const { handleSubmit, isSubmitting, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    fieldLabel: props.initialData?.title_match ?? '',
    link: props.initialData?.title_links ?? '',
  },
})

// Submit Handler
const onSubmit = handleSubmit(async (values) => {

  const payload = ref({})
  // edit
  if (isEditMode.value) {
    payload.value = {
      title_match: values.fieldLabel,
      title_links: values.link,
    }
  }
  // add
  else {
    payload.value = {
      title_match: values.fieldLabel,
      title_links: values.link,
      is_deleted: false,
      user_id: user.value?.id,
    }
  }

  try {
    const response = isEditMode.value
      ? await useApi().post(`/custom-field-value/${props.initialData?.id}`, {
        ...payload.value,
      })
      : await useApi().put('custom-field-labels-value', {
        ...payload.value,
      })

    if (response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })
      resetForm()
      open.value = false
      refreshNuxtData('custom-field-list')
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
})

watch(open, async (newVal) => {
  if (newVal) {
    await Promise.all([
      refreshLabels(),
    ])
    // Set initial values
    if (props.initialData?.id) {
      setFieldValue('fieldLabel', props.initialData.title_match)
      setFieldValue('link', props.initialData.title_links)
      resetForm({
        values: {
          fieldLabel: props.initialData.title_match,
          link: props.initialData.title_links,
        },
      })
    }
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? 'Edit Custom Field Value' : 'Add Custom Field Value' }}
        </DialogTitle>
      </DialogHeader>
      <Separator />
      <form class="space-y-4 mt-4" @submit="onSubmit">
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
                <SelectItem v-if="fieldLabelListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                  <Icon name="eos-icons:loading" />
                </SelectItem>
                <template v-else>
                  <SelectItem
                    v-for="label in fieldLabelList"
                    :key="label.id"
                    :value="label.title"
                  >
                    {{ label.title }}
                  </SelectItem>
                </template>
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
          <Button type="submit" class="flex-1 h-11" :disabled="isSubmitting" :loading="isSubmitting">
            <Icon name="material-symbols:save" size="20" />
            Update
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
