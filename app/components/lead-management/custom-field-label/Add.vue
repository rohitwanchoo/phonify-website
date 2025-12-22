<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import { Separator } from '@/components/ui/separator'

const props = withDefaults(defineProps<{
  open: boolean
  mode?: 'add' | 'edit'
  initialData?: { id: number, title: string } | null
}>(), {
  mode: 'add',
})

const emits = defineEmits(['refresh', 'closed'])

const modelOpen = defineModel<boolean>('open', { default: false })

const dialogTitle = computed(() =>
  props.mode === 'edit' ? 'Edit Custom Field Label' : 'Add Custom Field Label',
)

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Title is required'),
}))

// Initialize form with validateOnMount: false
const { handleSubmit, resetForm, setValues, setFieldError } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
  },
  validateOnMount: false,
})

const loading = ref(false)

watch(
  () => props.initialData,
  (data) => {
    if (data && props.mode === 'edit') {
      setValues({ title: data.title })
    }
  },
  { immediate: true },
)

// Reset everything when dialog opens/closes
watch(modelOpen, (isOpen) => {
  if (isOpen) {
    // Reset when opening
    resetForm({
      values: {
        title: props.mode === 'edit' && props.initialData?.title ? props.initialData.title : '',
      },
      errors: {},
    })
  }
  else {
    // Clean up when closing
    emits('closed')
  }
})

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    title: values.title,
  }

  try {
    loading.value = true

    let response

    if (props.mode === 'edit' && props.initialData?.id) {
      // EDIT MODE
      response = await useApi().post(`/custom-field-label/${props.initialData.id}`, payload)
    }
    else {
      // ADD MODE
      response = await useApi().put('/custom-field-label', payload)
    }

    if (response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })
      modelOpen.value = false
      emits('refresh')
    }
    else {
      // handleFieldErrors(response)
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    handleFieldErrors(error.data, setFieldError as any)
    showToast({
      message: error.message,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog v-model:open="modelOpen">
    <DialogTrigger as-child>
      <Button class="h-11">
        <Icon class="!text-white" name="material-symbols:add" size="20" />
        Add Custom Field Label
      </Button>
    </DialogTrigger>
    <DialogContent
      class="max-h-[90vh] h-fit overflow-y-auto"
    >
      <DialogHeader>
        <DialogTitle>{{ dialogTitle }}</DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <form id="form" @submit.prevent="onSubmit">
        <div class="space-y-4">
          <FormField v-slot="{ field }" name="title">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  class="h-11"
                  v-bind="field"
                  placeholder="Label Title"ß
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button
            class="flex-1 h-11 text-primary"
            variant="outline"
            type="button"
            @click="modelOpen = false"
          >
            <Icon name="material-symbols:close" size="20" />
            Close
          </Button>
          <Button type="submit" class="flex-1 h-11" :loading="loading" :disabled="loading">
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
