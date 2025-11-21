<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import * as z from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

const breadcrumbs = [
  {
    label: 'Manage Prompts',
    href: '/app/configuration/ai-prompts',
  },
  {
    label: 'Add New Prompt',
    active: true,
  },
]

// Dialog state for Add Function
const addFunctionDialogOpen = ref(false)

// Dummy data for voice options
const voiceOptions = [
  { id: 1, name: 'Voice 1 - Female', value: 'voice_1_female' },
  { id: 2, name: 'Voice 2 - Male', value: 'voice_2_male' },
  { id: 3, name: 'Voice 3 - Neutral', value: 'voice_3_neutral' },
  { id: 4, name: 'Voice 4 - Professional', value: 'voice_4_professional' },
]

// Dummy data for lead placeholders
const leadPlaceholderOptions = [
  { id: 1, name: 'First Name', value: 'first_name' },
  { id: 2, name: 'Last Name', value: 'last_name' },
  { id: 3, name: 'Company Name', value: 'company_name' },
  { id: 4, name: 'Email', value: 'email' },
  { id: 5, name: 'Phone Number', value: 'phone_number' },
  { id: 6, name: 'Address', value: 'address' },
]

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, 'Title is required'),
    voice: z.string().min(1, 'Voice selection is required'),
    initial_greeting: z.string().min(1, 'Initial greeting is required'),
    lead_placeholder: z.string().optional(),
    description: z.string().min(1, 'Description is required'),
  }),
)

const { handleSubmit, values, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    voice: '',
    initial_greeting: '',
    lead_placeholder: '',
    description: '',
  },
})

// Function to insert placeholder into description
function insertPlaceholder(placeholder: string) {
  const currentDescription = values.description || ''
  const newDescription = `${currentDescription}{{${placeholder}}} `
  setFieldValue('description', newDescription)
}

// Watch lead_placeholder changes and insert into description
watch(() => values.lead_placeholder, (newVal) => {
  if (newVal) {
    insertPlaceholder(newVal)
    // Reset the select after inserting
    setFieldValue('lead_placeholder', '')
  }
})

const onSubmit = handleSubmit(async (values) => {
  try {
    // Simulating API call
    console.log('Form values:', values)

    // Replace with actual API call
    // const response = await useApi().post('/save-prompt', values)

    // Simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))

    showToast({
      message: 'Prompt saved successfully',
      type: 'success',
    })
  }
  catch (error: any) {
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
})

// Listen function (placeholder)
function onListen() {
  showToast({
    message: 'Text-to-speech feature coming soon',
    type: 'info',
  })
}
</script>

<template>
  <BaseHeader title="Add New Prompt" :breadcrumbs="breadcrumbs">
    <template #actions>
      <Button
        class="h-11 bg-red-600 hover:bg-red-500"
        @click="addFunctionDialogOpen = true"
      >
        <Icon class="!text-white text-xl" name="material-symbols:add" />
        Add Function
      </Button>
    </template>
  </BaseHeader>

  <div class="relative h-[calc(100vh-190px)] overflow-y-auto mt-6">
    <form class="space-y-4 h-full" @submit.prevent="onSubmit">
      <div class="h-full rounded-lg bg-white">
        <div class="sticky top-0 right-0 z-10 w-full bg-white border rounded-t-lg px-5 py-5 flex items-center justify-between">
          <div class="text-lg font-medium text-primary/100">
            Prompt Details
          </div>
          <Button
            type="button"
            class="h-9 bg-primary hover:bg-primary/90"
            @click="onListen"
          >
            <Icon name="material-symbols:volume-up" class="text-base" />
            Listen
          </Button>
        </div>

        <div class="p-5 w-full border-x space-y-5">
          <div class="grid grid-cols-2 gap-5 items-start">
            <!-- Title -->
            <FormField v-slot="{ componentField, errorMessage }" name="title">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter Title Name"
                    :class="errorMessage && 'border-red-600'"
                    class="w-full !h-11"
                  />
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>

            <!-- Voice -->
            <FormField v-slot="{ componentField, errorMessage }" name="voice">
              <FormItem>
                <FormLabel class="font-normal text-sm">
                  Voice
                </FormLabel>
                <FormControl>
                  <Select v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue placeholder="Select Voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="item in voiceOptions" :key="item.id" :value="item.value">
                        {{ item.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>

          <!-- Initial Greeting -->
          <FormField v-slot="{ componentField, errorMessage }" name="initial_greeting" class="col-span-2">
            <FormItem>
              <FormLabel class="font-normal text-sm">
                Initial Greeting
              </FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="Enter Greeting"
                  :class="errorMessage && 'border-red-600'"
                  class="w-full min-h-[100px] resize-none"
                  rows="4"
                />
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>

          <!-- Lead Placeholders -->
          <FormField v-slot="{ componentField }" name="lead_placeholder" class="col-span-2">
            <FormItem>
              <FormLabel class="font-normal text-sm">
                Lead Placeholders
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select to Insert" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="item in leadPlaceholderOptions" :key="item.id" :value="item.value">
                      {{ item.name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          </FormField>

          <!-- Description with Rich Text Editor -->
          <FormField v-slot="{ componentField, errorMessage }" name="description" class="col-span-2">
            <FormItem>
              <FormLabel class="font-normal text-sm">
                Description
              </FormLabel>
              <FormControl>
                <div class="w-full border rounded-md" :class="errorMessage && 'border-red-600'">
                  <!-- Text Area -->
                  <Textarea
                    v-bind="componentField"
                    placeholder="Email Template..."
                    class="w-full min-h-[300px] border-0 rounded-none rounded-b-md resize-none focus-visible:ring-0"
                    rows="12"
                  />
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>

        <!-- Form Actions -->
        <div class="sticky bottom-0 right-0 w-full bg-white p-4 border rounded-b-lg">
          <Button
            class="w-full h-12 bg-red-600 hover:bg-red-500"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </div>
    </form>
  </div>

  <!-- Add Function Dialog -->
  <ConfigurationAiPromptsAddOrEditFunction v-model:open="addFunctionDialogOpen" />
</template>
