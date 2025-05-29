<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
</script>

<template>
  <div class="relative w-full h-full flex flex-col border rounded-lg overflow-hidden">
    <!-- Scrollable content container -->
    <div class="flex-1 overflow-auto px-4 py-6 space-y-6">
      <!-- Textarea section -->
      <div class="space-y-2">
        <Label for="description" class="text-primary">Audio File Description</Label>
        <Textarea id="description" placeholder="Enter a description..." class="w-full min-h-[150px]" />
      </div>

      <!-- Tabs section -->
      <Tabs default-value="file" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            <ProfileVoicemailFileUpload />
          </TabsTrigger>
          <TabsTrigger value="text">
            <ProfileVoicemailTextToAudio />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <p>Upload File</p>
          <!-- Add file upload controls here -->
        </TabsContent>

        <TabsContent value="text">
          <p>Text To Audio</p>
          <!-- Add text-to-audio input here -->
        </TabsContent>
      </Tabs>
    </div>

    <!-- Fixed Save Button -->
    <div class="sticky bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
      <Button class="w-full">
        Save
      </Button>
    </div>
  </div>
</template>
