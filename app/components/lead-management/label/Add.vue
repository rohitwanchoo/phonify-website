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

const open = defineModel<boolean>('open', { default: false })

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'Title is required'),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    title: values.title,
  }

  try {
    loading.value = true
    const response = await useApi().post('/add-label', {
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
      <Button>
        <Icon class="!text-white" name="lucide:plus" />
        Add Label
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Label</DialogTitle>
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
