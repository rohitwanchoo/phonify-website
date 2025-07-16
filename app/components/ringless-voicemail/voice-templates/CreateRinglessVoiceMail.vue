<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

// Form data ref
const formData = ref({
  description: '',
  audioUrl: '',
})

// Sync form data when `props.item` changes
watch(
  () => props.item,
  (newItem) => {
    formData.value.description = newItem.description
    formData.value.audioUrl = newItem.audioUrl
  },
  { immediate: true, deep: true },
)

function handleSave() {
  emit('save', formData.value)
  emit('update:open', false)
}

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

      <Tabs default-value="file" class="w-full">
        <div class="space-y-2">
          <Label for="description" class="text-primary text-sm pb-2">Audio File Description</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="Enter here..."
            class="w-full min-h-[100px]"
          />
        </div>

        <TabsList class="grid w-full grid-cols-2 p-0">
          <TabsTrigger value="file" class="data-[state=active]:bg-[#00A086] data-[state=active]:text-white font-light">
            Upload File
          </TabsTrigger>
          <TabsTrigger value="text" class="data-[state=active]:bg-[#00A086] data-[state=active]:text-white font-light">
            Text to Audio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <Label class="text-primary mt-4">Upload File*</Label>
          <RinglessVoicemailVoiceTemplatesVoiceTemplateFileUpload />
        </TabsContent>

        <TabsContent value="text">
          <RinglessVoicemailVoiceTemplatesVoiceTemplateTextToAudio />
        </TabsContent>
      </Tabs>

      <DialogFooter class="flex justify-between items-center">
        <Button variant="outline" class="w-[49%]" @click="onOpenChange(false)">
          <Icon name="lucide:x" class="w-4 h-4 mr-1" />
          Discard
        </Button>
        <Button type="submit" class="w-[49%]" @click="handleSave">
          <Icon name="lucide:save" class="w-4 h-4 mr-1" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
