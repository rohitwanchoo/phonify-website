<!-- components/EditDialog.vue -->
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{ rowData?: { campaign_name?: string, description?: string } }>()
const open = defineModel('open', { type: Boolean, default: false })
const formSchema = toTypedSchema(
  z.object({
    campaign_name: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required').max(200, 'Max 200 characters'),
  }),
)

const { handleSubmit, resetForm, isSubmitting, setValues } = useForm({
  validationSchema: formSchema,
})

watch(
  () => props.rowData,
  (val) => {
    if (val) {
      setValues({
        campaign_name: val.campaign_name || '',
        description: val.description || '',
      })
    }
  },
  { immediate: true },
)

const onSubmit = handleSubmit((values) => {
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
  <div>
    <!-- Dialog Content -->
    <Dialog :open="open" @update:open="onOpenChange">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>
        <Separator />

        <form class="space-y-4 mt-4" @submit.prevent="onSubmit">
          <!-- Campaign Name Input -->
          <FormField v-slot="{ componentField }" name="campaign_name">
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

          <!-- Description Textarea -->
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
  </div>
</template>
