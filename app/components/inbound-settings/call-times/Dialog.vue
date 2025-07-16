<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

const props = defineProps<{
  open: boolean
  rowData?: any
}>()

const emit = defineEmits(['update:open', 'submit'])

const loading = ref(false)
const isEditMode = computed(() => !!props.rowData)

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

// Watch for changes in the open prop to handle form initialization
watch(() => props.open, (val) => {
  if (val) {
    if (isEditMode.value && props.rowData) {
      resetForm({
        values: {
          clientName: props.rowData.title || '',
          description: props.rowData.description || '',
          ...generateDayTimeFields(props.rowData.data || [])
        },
      })
    }
    else {
      resetForm()
    }
  }
})

// Helper function to generate day time fields from data
function generateDayTimeFields(data: any[]) {
  const fields: Record<string, string> = {}
  daysOfWeek.forEach(day => {
    const dayData = data.find(d => d.day === day) || { from: '', to: '' }
    fields[`${day.toLowerCase()}From`] = dayData.from || ''
    fields[`${day.toLowerCase()}To`] = dayData.to || ''
  })
  return fields
}

// Form validation schema
const formSchema = toTypedSchema(z.object({
  clientName: z.string().min(1, 'Client name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  ...daysOfWeek.reduce((schema, day) => {
    const dayLower = day.toLowerCase()
    return {
      ...schema,
      [`${dayLower}From`]: z.string().optional(),
      [`${dayLower}To`]: z.string().optional()
    }
  }, {})
}))

const { handleSubmit, resetForm, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    clientName: '',
    description: '',
    ...daysOfWeek.reduce((fields, day) => {
      const dayLower = day.toLowerCase()
      return {
        ...fields,
        [`${dayLower}From`]: '',
        [`${dayLower}To`]: ''
      }
    }, {})
  },
})

const onSubmit = handleSubmit((values) => {
  loading.value = true
  
  // Format the data to match the dummy data structure
  const formattedData = daysOfWeek.map(day => {
    const dayLower = day.toLowerCase()
    return {
      id: daysOfWeek.indexOf(day) + 1,
      day,
      from: values[`${dayLower}From`] || '',
      to: values[`${dayLower}To`] || ''
    }
  })

  const result = {
    title: values.clientName,
    description: values.description,
    data: formattedData
  }

  console.log('Form data:', result)
  
  loading.value = false
  emit('update:open', false)
  emit('submit', result)
})
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? 'Edit Call Timing' : 'Add Call Timing' }}
        </DialogTitle>
    </DialogHeader>
    <Separator class="" />
      <form class="space-y-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="clientName">
          <FormItem>
            <p class="text-primary text-sm">
              Title
            </p>
            <FormControl>
              <Input
                placeholder="Enter client name"
                class="h-11"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <p class="text-primary text-sm">
              Description
            </p>
            <FormControl>
              <Textarea
                placeholder="Enter description"
                class="min-h-[100px]"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <div class="space-y-3">
          <div v-for="day in daysOfWeek" :key="day" class="flex items-center gap-4">
            <div class="w-24 text-sm font-medium text-gray-700">
              {{ day }}
            </div>
            <FormField v-slot="{ componentField }" :name="`${day.toLowerCase()}From`">
              <FormItem class="flex-1">
                <FormControl>
                  <div class="flex items-center justify-between border border-gray-300 rounded-md px-2">
                    <div class="text-sm text-muted-foreground">
                      From:
                    </div>
                    <Input 
                      v-bind="componentField" 
                      type="time" 
                      class="border-none shadow-none ml-auto w-28" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" :name="`${day.toLowerCase()}To`">
              <FormItem class="flex-1">
                <FormControl>
                  <div class="flex items-center justify-between border border-gray-300 rounded-md px-2">
                    <div class="text-sm text-muted-foreground">
                      To:
                    </div>
                    <Input 
                      v-bind="componentField" 
                      type="time" 
                      class="border-none shadow-none ml-auto w-28" 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <DialogFooter class="pt-4">
          <Button
            type="button"
            variant="outline"
            class="w-[50%] border-red-500 text-red-500 bg-red-50 hover:bg-white hover:text-red-500"
            @click="emit('update:open', false)"
          >
            <Icon name="material-symbols:close" />
            Discard
          </Button>
          <Button
            type="submit"
            class="w-[50%]"
            :disabled="loading"
          >
            <Icon name="material-symbols:save" />
            {{ loading ? 'Saving...' : isEditMode ? 'Update' : 'Save' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>