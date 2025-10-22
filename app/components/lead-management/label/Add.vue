<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'

const props = defineProps<{
  initialData?: Record<string, any> | null
  isEdit?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Title is required'),
}))

const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: props.initialData?.title ?? null,
  },
})

const loading = ref(false)

watch(() => open.value, (newVal) => {
  if (newVal && props.isEdit) {
    setFieldValue('title', props.initialData?.title)
  }
  else {
    setFieldValue('title', '')
  }
})

const onSubmit = handleSubmit(async (values) => {
  const api = props.isEdit ? '/edit-label' : '/add-label'
  let payload = {}
  if (props.isEdit) {
    payload = {
      label_id: props.initialData?.id,
      title: values.title,
      is_delete: props.initialData?.is_delete,
    }
  }
  else {
    payload = {
      title: values.title,
    }
  }

  try {
    loading.value = true
    const response = await useApi().post(api, {
      ...payload,
    })
    if (response.success === 'true') {
      showToast({
        message: response.message,
        type: 'success',
      })
      resetForm()
      open.value = false
      loading.value = false
      refreshNuxtData('label')
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
  finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="!text-white" name="material-symbols:add" size="20" />
          Add Label
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {{ props.isEdit ? 'Edit' : 'Add' }} Label
        </DialogTitle>
      </DialogHeader>
      <Separator />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  class="h-11"
                  v-bind="componentField"
                  placeholder="Label Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button class="flex-1 h-11 text-primary" variant="outline" @click="open = false">
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
