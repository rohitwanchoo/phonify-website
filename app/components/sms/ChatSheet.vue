<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { Textarea } from '~/components/ui/textarea'

// UI state
const open = ref(false)
const uploadedFiles = ref<File[]>([])


// Country codes with USA first
const countryCodes = [
  { id: 2, name: 'USA', phonecode: '+1' }, // USA first
  { id: 1, name: 'Ind', phonecode: '+91' },
  { id: 3, name: 'UK', phonecode: '+44' },
  { id: 4, name: 'UAE', phonecode: '+971' },
]

// Form validation schema
const schema = z.object({
  from: z.string().min(1, 'From is required'),
  countryCode: z.string().min(1, 'Country code is required'),
  phoneNumber: z.string().min(5, 'Phone number must be at least 5 digits').regex(/^\d+$/, 'Only digits allowed'),
  template: z.string().min(1, 'Template is required'),
  text: z.string().min(1, 'Message is required'),
  files: z.array(z.instanceof(File)).optional(),
})

const { handleSubmit, defineField, values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    from: '',
    countryCode: '+1', // USA set as default
    phoneNumber: '',
    template: '',
    text: '',
    files: [],
  },
})
// Define form fields
const [from, fromAttrs] = defineField('from')
const [countryCode, countryCodeAttrs] = defineField('countryCode')
const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber')
const [template, templateAttrs] = defineField('template')
const [text, textAttrs] = defineField('text')
const [files, filesAttrs] = defineField('files')

// File handlers
function handleFileChange(event: Event) {
  const fileList = (event.target as HTMLInputElement)?.files
  if (fileList) {
    const list = Array.from(fileList)
    uploadedFiles.value = list
    files.value = list
  }
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const fileList = event.dataTransfer?.files
  if (fileList) {
    const list = Array.from(fileList)
    uploadedFiles.value = list
    files.value = list
  }
}

const onSubmit = handleSubmit((formData) => {
  console.log('Form submitted:', formData)
})
</script>

<template>
  <Button @click="open = true">
    <Icon name="lucide:plus" class="!text-white" />
    New Message
  </Button>

  <Sheet v-model:open="open">
    <SheetContent class="w-full md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          New Message
        </SheetTitle>
      </SheetHeader>

      <form class="flex-1 flex flex-col justify-between overflow-hidden" @submit.prevent="onSubmit">
        <div class="p-6 space-y-5 overflow-y-auto">
          <!-- From -->
          <FormField name="from">
            <FormItem>
              <FormLabel>From</FormLabel>
              <FormControl>
                <Select v-bind="fromAttrs" v-model="from">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select From" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campaign_1">
                      Campaign 1
                    </SelectItem>
                    <SelectItem value="campaign_2">
                      Campaign 2
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- To -->
          <FormField name="phoneNumber">
            <FormItem>
              <FormLabel>To</FormLabel>
              <div class="flex">
                <!-- Country Code -->
                <FormField name="countryCode">
                  <FormItem class="w-[120px] !gap-0">
                    <FormControl>
                      <Select v-bind="countryCodeAttrs" v-model="countryCode">
                        <SelectTrigger class="w-full rounded-r-none bg-gray-100 !h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="item in countryCodes" :key="item.id" :value="item.phonecode">
                            {{ item.name }} ({{ item.phonecode }})
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </FormField>

                <!-- Phone Number -->
                <FormControl>
                  <Input
                    v-model="phoneNumber"
                    type="tel"
                    placeholder="Enter Phone Number"
                    class="!h-11 rounded-l-none flex-1"
                    v-bind="phoneNumberAttrs"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Template -->
          <FormField name="template">
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select v-bind="templateAttrs" v-model="template">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template_1">
                      Template 1
                    </SelectItem>
                    <SelectItem value="template_2">
                      Template 2
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Text -->
          <FormField name="text">
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  v-model="text"
                  class="w-full min-h-[100px]"
                  placeholder="Enter your message..."
                  v-bind="textAttrs"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- File Upload -->
          <FormField name="files">
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <div
                  class="w-full p-[30px] mt-2 border-2 border-dashed border-[#00A086] text-sm text-muted-foreground rounded-md cursor-pointer bg-[#F0F9F8] hover:bg-muted/80 transition flex flex-col items-center justify-center"
                  @dragover.prevent
                  @drop="handleDrop"
                >
                  <label for="file-upload" class="text-center cursor-pointer">
                    <Icon name="icons:upload" class="text-5xl" />
                    <p>
                      <span class="text-muted-foreground">Drag & drop or </span>
                      <span class="text-primary underline">choose file</span>
                    </p>
                    <input
                      id="file-upload"
                      type="file"
                      class="hidden"
                      accept=".mp3,.wav"
                      @change="handleFileChange"
                    >
                  </label>
                  <div v-if="uploadedFiles.length" class="mt-2">
                    Selected: {{ uploadedFiles.map(f => f.name).join(', ') }}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Footer -->
        <div class="p-6 bg-white">
          <Button class="w-full h-12 text-md" type="submit">
            <Icon name="material-symbols:send-outline" class="text-md" />
            Send
          </Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>
