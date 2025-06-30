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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const open = ref(false)

// Field label options
const fieldLabelOptions = [
  { label: 'Facebook', value: 'Facebook' },
  { label: 'Twitter', value: 'Twitter' },
  { label: 'LinkedIn', value: 'LinkedIn' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Google', value: 'Google' },
  { label: 'YouTube', value: 'YouTube' },
  { label: 'Affiliate Link', value: 'Affiliate Link' },
]

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    fieldLabel: z.string().min(1, 'Field label is required'),
    link: z.string().min(1, 'Link is required').url('Please enter a valid URL'),
  }),
)

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted:', values)
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
    <!-- Dialog Trigger Button -->
    <Button @click="open = true">
      <Icon class="!text-white" name="lucide:plus" />
      Add Custom Field Value
    </Button>

    <!-- Dialog Content -->
    <Dialog :open="open" @update:open="onOpenChange">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Custom Value</DialogTitle>
        </DialogHeader>
        <Separator />

        <form class="space-y-4 mt-4" @submit.prevent="onSubmit">
          <!-- Field Label Dropdown -->
          <FormField v-slot="{ componentField }" name="fieldLabel">
            <FormItem>
              <FormLabel>Custom Field Label</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a field label" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    v-for="label in fieldLabelOptions"
                    :key="label.value"
                    :value="label.value"
                  >
                    {{ label.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Link Input -->
          <FormField v-slot="{ componentField }" name="link">
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter title Link"
                  v-bind="componentField"
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
