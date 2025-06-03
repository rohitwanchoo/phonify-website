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
  <div class="relative w-full h-full flex flex-col overflow-hidden p-5">
    <!-- Scrollable content container -->
    <div class="flex-1  pt-2 space-y-6">
      <!-- Textarea section -->
      <div class="space-y-2">
        <Label for="description" class="text-primary text-xs font-normal">Audio File Description</Label>
        <Textarea id="description" placeholder="Enter here..." class="w-full min-h-[150px]" />
      </div>

      <!-- Tabs section -->
      <Tabs default-value="file" class="w-full">
        <TabsList class="grid w-full grid-cols-2 p-0">
          <TabsTrigger value="file" class="data-[state=active]:bg-[#00A086] data-[state=active]:text-white font-light">
            <p>
              Upload File
            </p>
          </TabsTrigger>
          <TabsTrigger value="text" class="data-[state=active]:bg-[#00A086] data-[state=active]:text-white font-light">
            <p>Text to Audio</p>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <Label for="file upload" class="text-primary mt-4">Upload File*</Label>
          <ProfileVoicemailFileUpload />
          <!-- Add file upload controls here -->
        </TabsContent>

        <TabsContent value="text">
          <ProfileVoicemailTextToAudio />
        </TabsContent>
      </Tabs>
    </div>

    <!-- Fixed Save Button -->
    <!-- <div class="sticky bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
      <Button class="w-full">
        Save
      </Button>
    </div> -->
  </div>
</template>
