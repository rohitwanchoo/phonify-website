<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Slider } from '~/components/ui/slider'
import { Textarea } from '~/components/ui/textarea'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Separator } from '@/components/ui/separator'

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

const onSubmit = handleSubmit((vals) => {
  // Submit logic here
})

// Use ref for sliders and sync with form on change
const speed = ref(1)
const pitch = ref(0)

watch(speed, val => setFieldValue('speed', val))
watch(() => values.speed, val => { if (speed.value !== val) speed.value = val })

watch(pitch, val => setFieldValue('pitch', val))
watch(() => values.pitch, val => { if (pitch.value !== val) pitch.value = val })

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
  <BaseHeader title="Add Voice Templates"/>


  <form class="w-full relative h-full border border-gray-200 rounded-xl p-6 flex flex-col gap-4 pb-4" @submit.prevent="onSubmit">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-primary">Voice Template details</h2>
      <Button class="flex items-center gap-2">
        <Icon name="material-symbols:volume-up" class="text-base" />
        Listen
      </Button>
    </div>
   <Separator />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
      <!-- Language Dropdown -->
      <div class="w-full">
        <label class="text-sm font-medium text-primary">Language</label>
        <Select v-model="values.language">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</SelectItem>
          </SelectContent>
        </Select>
        <div v-if="errors.language" class="text-xs text-red-500 mt-1">{{ errors.language }}</div>
      </div>
      <!-- Voice Name Dropdown -->
      <div class="w-full">
        <label class="text-sm font-medium text-primary">Voice Name</label>
        <Select v-model="values.voiceName">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="voice in voices" :key="voice" :value="voice">{{ voice }}</SelectItem>
          </SelectContent>
        </Select>
        <div v-if="errors.voiceName" class="text-xs text-red-500 mt-1">{{ errors.voiceName }}</div>
      </div>
      <!-- Template Name -->
      <div>
        <label class="text-sm font-medium text-primary">Template Name</label>
        <Input v-model="values.templateName" placeholder="Enter template name" />
        <div v-if="errors.templateName" class="text-xs text-red-500 mt-1">{{ errors.templateName }}</div>
      </div>
      <!-- Labels -->
      <div>
        <label class="text-sm font-medium text-primary">Labels</label>
        <Input v-model="values.labels" placeholder="Enter labels" />
        <div v-if="errors.labels" class="text-xs text-red-500 mt-1">{{ errors.labels }}</div>
      </div>
      <!-- Sender Details -->
      <div>
        <label class="text-sm font-medium text-primary">Sender Details</label>
        <Input v-model="values.senderDetails" placeholder="Enter sender details" />
        <div v-if="errors.senderDetails" class="text-xs text-red-500 mt-1">{{ errors.senderDetails }}</div>
      </div>
      <!-- Custom Placeholders -->
      <div>
        <label class="text-sm font-medium text-primary">Custom Placeholders</label>
        <Input v-model="values.customPlaceholders" placeholder="Enter custom placeholders" />
        <div v-if="errors.customPlaceholders" class="text-xs text-red-500 mt-1">{{ errors.customPlaceholders }}</div>
      </div>
      <!-- Speed Slider -->
      <div>
        <label class="text-sm font-medium text-primary">Speed</label>
        <Slider
          v-model="speed"
          :min="0.5"
          :max="2"
          :step="0.01"
          class="mt-2"
        />
        <div class="text-xs text-muted-foreground mt-1">Value: {{ speed }}</div>
        <div v-if="errors.speed" class="text-xs text-red-500 mt-1">{{ errors.speed }}</div>
      </div>
      <!-- Pitch Slider -->
      <div>
        <label class="text-sm font-medium text-primary">Pitch</label>
        <Slider
          v-model="pitch"
          :min="-12"
          :max="12"
          :step="1"
          class="mt-2"
        />
        <div class="text-xs text-muted-foreground mt-1">Value: {{ pitch }}</div>
        <div v-if="errors.pitch" class="text-xs text-red-500 mt-1">{{ errors.pitch }}</div>
      </div>
    </div>
    <!-- Template Preview -->
    <div class="flex flex-col gap-2 mt-4">
      <label class="text-sm font-medium text-primary">Template Preview</label>
      <Textarea v-model="values.templatePreview" placeholder="Preview your template here..." rows="4" class="h-[100px]" />
      <div v-if="errors.templatePreview" class="text-xs text-red-500 mt-1">{{ errors.templatePreview }}</div>
    </div>
    <!-- Submit Button (sticky to bottom of form div) -->
    <div class="absolute bottom-0 left-0 w-full flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] bg-white border-t border-gray-200 p-7 z-10">
      <Button type="submit" class="bg-[#162D3A] w-full py-6 text-md text-white flex items-center gap-2 hover:bg-[#162D3A] hover:text-white">
        <Icon name="material-symbols:save" />
        Submit
      </Button>
    </div>
  </form>
</template>
