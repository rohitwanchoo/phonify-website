<script setup lang="ts">
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
import Separator from '~/components/ui/separator/Separator.vue'

const props = defineProps<{
  item: {
    id: number
    extension: string
    audioUrl: string
  }
  open: boolean
  heading?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', data: { extension: string, audioUrl: string }): void
}>()

const open = defineModel('open', { type: Boolean, default: false })

const formData = ref({
  extension: props.item.extension,
  audioUrl: props.item.audioUrl,
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
        <DialogTitle>{{ props.heading ? heading : 'Heading Here' }}</DialogTitle>
        <Separator />
      </DialogHeader>
      <Tabs default-value="file" class="w-full">
        <div class="space-y-2">
          <Label for="description" class="text-primary text-sm pb-2">Audio File Description</Label>
          <Textarea id="description" placeholder="Enter here..." class="w-full min-h-[100px]" />
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
          <InboundSettingsDialogFileUpload />
        </TabsContent>

        <TabsContent value="text">
          <InboundSettingsDialogTextToAudio />
        </TabsContent>
      </Tabs>

      <DialogFooter class="flex justify-between items-center">
        <Button variant="outline" class="w-[49%] text-red-500 hover:text-red-600  bg-red-50 border-red-600" @click="onOpenChange(false)">
          <Icon name="lucide:x" class="w-4 h-4 mr-1  text-red-500" />
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
