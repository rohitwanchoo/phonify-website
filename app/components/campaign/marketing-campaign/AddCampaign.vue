<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { ref, watch } from 'vue'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  open: boolean
  rowData?: any
}>()
const open = defineModel('open', { type: Boolean, default: false })

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required').max(200, 'Max 200 characters'),
  }),
)

const { handleSubmit, resetForm, isSubmitting, setValues } = useForm({
  validationSchema: formSchema,
})

watch(() => props.rowData, (newData) => {
  if (newData) {
    setValues({
      title: newData.campaign_name || '',
      description: newData.description || '',
    })
  }
}, { immediate: true })

const onSubmit = handleSubmit((values) => {
  // handle save logic here
  open.value = false
})

function onOpenChange(isOpen: boolean) {
  if (!isOpen) {
    resetForm()
  }
  open.value = isOpen
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ rowData ? 'Edit Campaign' : 'Add Campaign' }}</DialogTitle>
      </DialogHeader>
      <Separator />

      <form class="space-y-4 mt-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="title">
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Enter Title Name"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Enter Description"
                rows="4"
                maxlength="200"
                class="xl:h-[130px] h-[50px] max-h-[190px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter class="w-full mt-4 flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" class="flex-1 h-11" as-child>
            <DialogClose @click="resetForm">
              <Icon name="material-symbols:close" size="20" />
              Close
            </DialogClose>
          </Button>
          <Button type="submit" class="flex-1 h-11" :disabled="isSubmitting">
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>