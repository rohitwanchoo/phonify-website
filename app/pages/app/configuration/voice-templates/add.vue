<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as z from 'zod'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,

} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Slider } from '~/components/ui/slider'
import { Textarea } from '~/components/ui/textarea'

const languages = ['English', 'Spanish', 'French', 'German']
const voices = ['Voice 1', 'Voice 2', 'Voice 3']

const formSchema = toTypedSchema(z.object({
  language: z.string().min(1, 'Language is required'),
  voiceName: z.string().min(1, 'Voice Name is required'),
  templateName: z.string().min(1, 'Template Name is required'),
  labels: z.string().min(1, 'Labels are required'),
  senderDetails: z.string().min(1, 'Sender Details are required'),
  customPlaceholders: z.string().min(1, 'Custom Placeholders are required'),
  speed: z.number().min(0.5, 'Min 0.5').max(2, 'Max 2'),
  pitch: z.number().min(-12, 'Min -12').max(12, 'Max 12'),
  templatePreview: z.string().min(1, 'Template Preview is required'),
}))

const { handleSubmit, resetForm, values, errors, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    language: '',
    voiceName: '',
    templateName: '',
    labels: '',
    senderDetails: '',
    customPlaceholders: '',
    speed: 1,
    pitch: 0,
    templatePreview: '',
  },
})

const router = useRouter()

const onSubmit = handleSubmit((vals) => {
  // Submit logic here
  router.push('/app/configuration/voice-templates')
})

// Use ref for sliders and sync with form on change
const speed = ref([1])
const pitch = ref([0])
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <div class="flex items-center gap-x-2">
        <BreadcrumbItem>
          <BreadcrumbLink href="/app/configuration/voice-templates" class="font-normal">
            Voice Templates
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            Add Voice Templates
          </BreadcrumbPage>
        </BreadcrumbItem>
      </div>
    </BreadcrumbList>
  </Breadcrumb>
  <BaseHeader title="Add Voice Templates" />

  <form class="w-full relative h-full border border-gray-200 rounded-xl py-4 md:py-6 flex flex-col gap-4 pb-4" @submit.prevent="onSubmit">
    <div class="overflow-y-auto max-h-[88%]">
      <div class="flex items-center justify-between px-4 md:px-6 pb-3">
        <h2 class="text-lg font-semibold text-primary">
          Voice Template details
        </h2>
        <Button class="flex items-center gap-2">
          <Icon name="material-symbols:volume-up" class="text-base" />
          Listen
        </Button>
      </div>
      <Separator />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 md:gap-y-6  px-6 pt-4">
        <!-- Language Dropdown -->
        <div class="w-full">
          <FormField v-slot="{ componentField, errorMessage }" name="language">
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11" :class="errorMessage && 'border-red-600'">
                    <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="lang in languages" :key="lang" :value="lang">
                      {{ lang }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Voice Name Dropdown -->
        <div class="w-full">
          <FormField v-slot="{ componentField, errorMessage }" name="voiceName">
            <FormItem>
              <FormLabel>Voice Name</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11" :class="errorMessage && 'border-red-600'">
                    <SelectValue
                      class="text-sm placeholder:text-[#ef698180]"
                      placeholder="Select voice"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="voice in voices" :key="voice" :value="voice">
                      {{ voice }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Template Name -->
        <div>
          <FormField v-slot="{ componentField }" name="templateName">
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter template name"
                  class="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Labels -->
        <div>
          <FormField v-slot="{ componentField }" name="labels">
            <FormItem>
              <FormLabel>Labels</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter labels"
                  class="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Sender Details -->
        <div>
          <FormField v-slot="{ componentField }" name="senderDetails">
            <FormItem>
              <FormLabel>Sender Details</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter sender details"
                  class="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Custom Placeholders -->
        <div>
          <FormField v-slot="{ componentField }" name="customPlaceholders">
            <FormItem>
              <FormLabel>Custom Placeholders</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter custom placeholders"
                  class="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- Speed Slider -->
        <div class="relative">
          <label class="text-sm font-medium text-primary flex justify-between items-center">
            <span>Speed</span>
            <span class="text-sm font-light">Value: x {{ (Array.isArray(speed) ? speed[0] : speed).toFixed(2) }}</span>
          </label>
          <div
            class="[&_[data-slot=slider-range]]:bg-[#00A086]
            [&_[data-slot=slider-thumb]]:bg-[#162D3A]
            [&_[data-slot=slider-thumb]]:border-[#162D3A]"
          >
            <Slider
              v-model="speed"
              :min="0.5"
              :max="2"
              :step="0.01"
              class="mt-2"
            />
          </div>
        </div>
        <!-- Pitch Slider -->
        <div class="relative">
          <label class="text-sm font-medium text-primary flex justify-between items-center">
            <span>Pitch</span>
            <span class="text-sm font-light">Value: {{ Array.isArray(pitch) ? pitch[0] : pitch }}</span>
          </label>
          <div
            class="[&_[data-slot=slider-range]]:bg-[#00A086]
            [&_[data-slot=slider-thumb]]:bg-[#162D3A]
            [&_[data-slot=slider-thumb]]:border-[#162D3A]"
          >
            <Slider
              v-model="pitch"
              :min="-12"
              :max="12"
              :step="1"
              class="mt-2"
            />
          </div>
        </div>
      </div>
      <!-- Template Preview -->
      <div class="flex flex-col gap-2 mt-4 relative px-6">
        <FormField v-slot="{ componentField }" name="templatePreview">
          <FormItem>
            <FormLabel>Template Preview</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Preview your template here..."
                rows="4"
                maxlength="200"
                class="xl:h-[130px] h-[50px] max-h-[190px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="text-xs text-muted-foreground select-none text-right mt-1">
          {{ values.templatePreview?.length || 0 }}/200 Characters
        </div>
      </div>
    </div>
    <!-- Submit Button (sticky to bottom of form div) -->
    <div class="absolute rounded-b-xl  bottom-0 left-0 w-full flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] bg-white border-t border-gray-200 p-7 z-10">
      <Button type="submit" class="bg-[#162D3A] w-full py-6 text-md text-white flex items-center gap-2 hover:bg-[#162D3A] hover:text-white">
        <Icon name="material-symbols:save" />
        Submit
      </Button>
    </div>
  </form>
</template>
