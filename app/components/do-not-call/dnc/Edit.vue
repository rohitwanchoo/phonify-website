<script setup lang="ts">
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Textarea from '~/components/ui/textarea/Textarea.vue'

const props = defineProps<{
  initialData: Record<string, any> | null
}>()

const open = defineModel<boolean>('open', { default: false })

const loading = ref(false)

// extension list options
const { data: extensionList, refresh: extensionRefresh } = await useLazyAsyncData('extension-group-map', () =>
  useApi().get('/extension-group-map'), {
  transform: res => res.data,
  immediate: false,
})

// Form Setup
const { handleSubmit, resetForm, setFieldValue } = useForm({
  initialValues: {
    extension: props.initialData?.extension ?? null,
    comment: props.initialData?.comment ?? null,
  },
})

// Submit Handler
const onSubmit = handleSubmit(async (values) => {
  const payload = {
    number: props.initialData?.number ?? null,
    extension: values.extension,
    comment: values.comment,
  }

  try {
    loading.value = true
    const response = await useApi().post('/edit-dnc', {
      ...payload,
    })

    if (response.success === 'true') {
      showToast({
        message: response.message,
        type: 'success',
      })
      resetForm()
      open.value = false
      refreshNuxtData('dnc-list')
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
      message: `${error?.message}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})

watch(open, async (newVal) => {
  if (newVal) {
    await Promise.all([
      extensionRefresh(),
    ])
    // Set initial values
    if (props.initialData) {
      setFieldValue('extension', props.initialData.extension)
      setFieldValue('comment', props.initialData.comment)
      resetForm({
        values: {
          extension: props.initialData.extension,
          comment: props.initialData.comment,
        },
      })
    }
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit DNC</DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField
            v-slot="{ componentField }"
            name="extension"
          >
            <FormItem>
              <FormLabel>Extensions</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select Extension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in extensionList" :key="option.extension" :value="option.extension">
                      {{ option.first_name }} {{ option.last_name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="comment"
          >
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" type="text" placeholder="Comment here" class="px-3 py-[14px] min-h-[104px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

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
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
