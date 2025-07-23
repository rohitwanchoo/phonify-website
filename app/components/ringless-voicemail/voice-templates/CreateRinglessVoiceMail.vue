<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

// Props and emits
const props = defineProps<{
  item: {
    id: number
    description: string
    audioUrl: string
  }
  open: boolean
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: { description: string, audioUrl: string }): void
}>()

const open = defineModel('open', { type: Boolean, default: false })
const activeTab = ref('file')

// Form validation schema
const schema = toTypedSchema(z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  audioUrl: z.string().url('Please enter a valid URL').optional().superRefine((val, ctx) => {
    if (activeTab.value === 'file' && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Audio URL is required when uploading file',
      })
    }
  }),
  // For text-to-audio tab
  language: z.string().optional(),
  voice: z.string().optional(),
  text: z.string().optional(),
}))

const { handleSubmit, setValues, setFieldValue } = useForm({
  validationSchema: schema,
})
const textToAudioRef = ref()

async function handleSave() {
  if (!textToAudioRef.value)
    return

  const { valid, errors, values } = await textToAudioRef.value.validateForm()

  if (!valid) {
    console.error('Form validation failed:', errors)
    return
  }

  // Proceed with saving the data
  console.log('Form data:', values)
  // You can also emit this data or call an API here
}
// Sync form data when `props.item` changes
watch(
  () => props.item,
  (newItem) => {
    setValues({
      description: newItem.description,
      audioUrl: newItem.audioUrl,
    })
  },
  { immediate: true, deep: true },
)

// Handle file upload success
function handleFileUpload(url: string) {
  setFieldValue('audioUrl', url)
}

const onSubmit = handleSubmit((values) => {
  emit('save', {
    description: values.description,
    audioUrl: activeTab.value === 'file' ? values.audioUrl : '', // Clear audioUrl if using text-to-audio
  })
  emit('update:open', false)
})

function onOpenChange(value: boolean) {
  emit('update:open', value)
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ props.mode === 'edit' ? 'Edit' : 'Create' }} Ringless Voice Template</DialogTitle>
      </DialogHeader>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <!-- Description Field -->
        <FormField v-slot="{ componentField }" name="description">
          <FormItem>
            <Label class="text-primary text-sm pb-2">Audio File Description</Label>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Enter here..."
                class="w-full min-h-[100px]"
              />
            </FormControl>
            <FormMessage class="text-xs" />
          </FormItem>
        </FormField>

        <Tabs v-model="activeTab" default-value="file" class="w-full">
          <TabsList class="grid w-full grid-cols-2 p-0">
            <TabsTrigger value="file" class="data-[state=active]:bg-[#00A086] data-[state=active]:text-white font-light">
              Upload File
            </TabsTrigger>
            <TabsTrigger value="text" class="data-[state=active]:bg-[#00A086] data-[state=active]:text-white font-light">
              Text to Audio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" class="mt-4">
            <FormField v-slot="{ componentField }" name="audioUrl">
              <FormItem>
                <Label class="text-primary">Upload File*</Label>
                <FormControl>
                  <RinglessVoicemailVoiceTemplatesVoiceTemplateFileUpload
                    @upload-success="handleFileUpload"
                  />
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </TabsContent>

          <TabsContent value="text" class="mt-4">
            <RinglessVoicemailVoiceTemplatesVoiceTemplateTextToAudio
              ref="textToAudioRef"
              @submit="(data) => {
                setFieldValue('language', data.language)
                setFieldValue('voice', data.voice)
                setFieldValue('text', data.text)
              }"
            />
          </TabsContent>
        </Tabs>

        <DialogFooter class="flex justify-between items-center pt-4">
          <Button variant="outline" class="w-[49%]" type="button" @click="onOpenChange(false)">
            <Icon name="lucide:x" class="w-4 h-4 mr-1" />
            Discard
          </Button>
          <Button class="w-[49%]" @click="handleSave">
            <Icon name="lucide:save" class="w-4 h-4 mr-1" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
