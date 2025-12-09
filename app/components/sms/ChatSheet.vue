<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
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

const open = ref(false)

const { data: smsDidList, status: smsDidListStatus, refresh: refreshSmsDidList } = await useLazyAsyncData('sms-did-list', () =>
  useApi().get('sms_did_list'), {
  transform: res => res.data,
  immediate: false,
})

const { data: countrylist, status: countrylistStatus, refresh: refreshCountrylist } = await useLazyAsyncData('phone-country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  immediate: false,
})

const { data: smsTemplateList, status: smsTemplateListStatus, refresh: refreshSmsTemplateList } = await useLazyAsyncData('sms-template', () =>
  useApi().post('/sms-templete'), {
  transform: res => res.data,
  immediate: false,
})

const file = ref<File | null>(null)
const { setValue: setFile } = useField('file')

function handleFileUpdate(files: File[]) {
  file.value = files[0] ?? null
  setFile(files)
}

// Watch for sheet open and refresh APIs only if data doesn't exist
watch(open, (isOpen) => {
  if (isOpen) {
    // Only refresh if data hasn't been loaded yet
    if (!smsDidList.value) {
      refreshSmsDidList()
    }
    if (!countrylist.value) {
      refreshCountrylist()
    }
    if (!smsTemplateList.value) {
      refreshSmsTemplateList()
    }
  }
})

const formSchema = toTypedSchema(z.object({
  from: z.string().min(1, 'From is required'),
  country_code: z.number().min(1, 'Country code is required'),
  to: z.string().min(5, 'Phone number required'),
  template: z.union([z.string(), z.number()]).optional(),
  message: z.string().min(1, 'Message is required'),
}))

const { handleSubmit, setValues, values, setFieldValue, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    from: '',
    country_code: 1,
    to: '',
    template: '',
    message: '',
  },
})

watch(() => values.template, (newVal) => {
  if (!newVal)
    return
  const tpl = smsTemplateList.value?.find((t: any) => String(t.templete_desc) === String(newVal))
  if (tpl?.templete_desc) {
    setFieldValue('message', tpl.templete_desc)
  }
})

const onSubmit = handleSubmit(async (vals) => {
  const toNumber = Number(String(vals.country_code) + String(vals.to).replace(/\D/g, ''))
  try {
    const formData = new FormData()
    formData.append('from', String(vals.from))
    formData.append('to', String(toNumber))
    formData.append('message', String(vals.message || ''))
    formData.append('mms_file', file.value as File)
    formData.append('date', new Date().toISOString())

    const response = await useApi().post('/send-sms', formData)
    if (response?.success === true) {
      showToast({ message: response?.message, type: 'success' })
      setValues({
        from: '',
        country_code: 1,
        to: '',
        template: '',
        message: '',
      })
      open.value = false
      refreshNuxtData('sms-chats')
    }
    else {
      showToast({
        message: response?.message,
        type: 'error',
      })
    }
  }
  catch (err: any) {
    showToast({
      message: err?.message,
      type: 'error',
    })
  }
})
</script>

<template>
  <Button class="h-11" @click="open = true">
    <Icon name="material-symbols:add" class="!text-white text-xl" />
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
          <FormField v-slot="{ componentField }" name="from">
            <FormItem>
              <FormLabel>From</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select From" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="smsDidListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="(option, index) in smsDidList" :key="index" :value="option.cli">
                        {{ formatNumber(option.cli) }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- To -->
          <FormField v-slot="{ componentField }" name="to">
            <FormItem>
              <FormLabel>To</FormLabel>
              <div class="flex">
                <!-- Country Code -->
                <FormField v-slot="{ value, handleChange }" name="country_code">
                  <FormItem class="w-[120px] !gap-0">
                    <FormControl>
                      <Select :model-value="value" @update:model-value="handleChange" :default-value="1">
                        <SelectTrigger class="w-full rounded-r-none bg-gray-100 !h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-if="countrylistStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                            <Icon name="eos-icons:loading" />
                          </SelectItem>
                          <template v-else>
                            <SelectItem v-for="(option, index) in countrylist" :key="index" :value="option.phone_code">
                              {{ option.country_code }} ({{ option.phone_code }})
                            </SelectItem>
                          </template>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                </FormField>

                <!-- Phone Number -->
                <FormControl>
                  <Input
                    v-maska="'(###)-###-####'"
                    v-bind="componentField"
                    type="tel"
                    placeholder="Enter Phone Number"
                    class="!h-11 rounded-l-none flex-1"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Template -->
          <FormField v-slot="{ componentField }" name="template">
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="smsTemplateListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="(option, index) in smsTemplateList" :key="index" :value="option.templete_desc">
                        {{ option?.templete_name }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Text -->
          <FormField v-slot="{ componentField }" name="message">
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" class="w-full min-h-[100px]" placeholder="Enter your message..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- File Upload -->
          <FormField v-slot="{ componentField }" name="file">
            <FormItem>
              <FormControl>
                <BaseFileUploader
                  v-bind="componentField"
                  accept=".png"
                  max-size="10MB"
                  @update:files="handleFileUpdate"
                />
              </FormControl>
              <FormMessage class="text-xs" />
            </FormItem>
          </FormField>
        </div>

        <!-- Footer -->
        <div class="p-6 bg-white">
          <Button class="w-full h-12 text-md" type="submit" :disabled="isSubmitting" :loading="isSubmitting">
            <Icon name="material-symbols:send-outline" class="text-md" />
            Send
          </Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>
