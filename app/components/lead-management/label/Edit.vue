<script setup lang="ts">
import { Icon } from '#components'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const props = defineProps<{
  initialData: Record<string, any> | null
}>()

const open = defineModel<boolean>('open', { default: false })

const loading = ref(false)

// Form Setup
const { handleSubmit, resetForm, setFieldValue } = useForm({
  initialValues: {
    title: props.initialData?.title ?? null,
  },
})

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    label_id: props.initialData?.id,
    title: values.title,
    is_delete: props.initialData?.is_delete,
  }

  try {
    loading.value = true
    const response = await useApi().post('/edit-label', {
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

watch(open, () => {
  // Set initial values
  if (props.initialData) {
    setFieldValue('title', props.initialData.title)
    resetForm({
      values: {
        title: props.initialData.title,
      },
    })
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Label</DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField v-slot="{ componentField }" name="title">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Label Name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button class="w-[50%] text-primary" variant="outline" @click="open = false">
            <Icon name="lucide:x" class="w-4 h-4 mr-1" />
            Close
          </Button>
          <Button type="submit" class="w-[50%]" :loading="loading" :disabled="loading">
            <Icon name="material-symbols:save" class="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
