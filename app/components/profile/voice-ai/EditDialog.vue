<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  item: {
    id: number
    extension: string
    audioUrl: string
  },
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: { extension: string, audioUrl: string }): void
}>()

const formData = ref({
  extension: props.item.extension,
  audioUrl: props.item.audioUrl
})

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
        <DialogTitle>Create New Call Time</DialogTitle>
      </DialogHeader>

      <Tabs default-value="file" class="w-full">
        <div class="space-y-2">
          <Label for="description" class="text-primary text-sm pb-2">Audio File Description</Label>
          <Textarea id="description" placeholder="Enter here..." class="w-full min-h-[100px]" />
        </div>
        <TabsList class="grid w-full grid-cols-2 p-0">
          <TabsTrigger value="file" class="data-[state=active]:bg-[#00A086] data-[state=active]:text-white font-light">
            <p>Upload File</p>
          </TabsTrigger>
          <TabsTrigger value="text" class="data-[state=active]:bg-[#00A086] data-[state=active]:text-white font-light">
            <p>Text to Audio</p>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <Label for="file upload" class="text-primary mt-4">Upload File*</Label>
          <ProfileVoiceAiFileUpload />
        </TabsContent>

        <TabsContent value="text">
          <ProfileVoiceAiTextToAudio />
        </TabsContent>
      </Tabs>

      <DialogFooter class="flex justify-between items-center">
        <Button variant="outline" class="w-[49%] hover:text-red-400 border-red-400 bg-white hover:bg-red-100 text-red-400" @click="onOpenChange(false)">
          <Icon name="lucide:x" class="w-4 h-4 mr-1" />Cancel
        </Button>
        <Button type="submit" class="w-[49%]" @click="handleSave">
          <Icon name="lucide:save" class="w-4 h-4 mr-1" />
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>