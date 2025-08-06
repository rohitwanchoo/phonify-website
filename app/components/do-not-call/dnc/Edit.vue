<script setup lang="ts">
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Textarea from '~/components/ui/textarea/Textarea.vue'

const props = defineProps<{
  initialData: Record<string, any> | null
}>()

const open = defineModel<boolean>('open', { default: false })

// extension list options
const { data: extensionList, status: extensionListStatus, refresh: extensionRefresh } = await useLazyAsyncData('extension-group-map', () =>
  useApi().get('/extension-group-map'), {
  transform: res => res.data,
  immediate: false,
})

// Form Setup
const { handleSubmit, isSubmitting, resetForm, setFieldValue } = useForm({
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
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select Extension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="extensionListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in extensionList" :key="option.extension" :value="option.extension">
                        {{ option.first_name }} {{ option.last_name }}
                      </SelectItem>
                    </template>
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
            <Button class="flex-1 h-11 text-primary" variant="outline" @click="open = false">
              <Icon name="material-symbols:close" size="20"/>
              Close
            </Button>
            <Button type="submit" class="flex-1 h-11" :loading="isSubmitting" :disabled="isSubmitting">
              <Icon name="material-symbols:save" size="20"/>
              Save
            </Button>
          </div>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
