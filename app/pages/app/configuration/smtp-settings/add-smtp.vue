<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as z from 'zod'

import Failed from '@/components/configuration/smtp-settings/Failed.vue'
import Verified from '@/components/configuration/smtp-settings/Verified.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'

const driverOptions = ['SMTP', 'Sendmail', 'Mailgun']
const encryptionOptions = ['None', 'SSL', 'TLS']
const emailTypeOptions = ['Transactional', 'Marketing']
const senderNameOptions = ['Company A', 'Company B']

const formSchema = toTypedSchema(z.object({
  driverName: z.string().min(1, 'Driver Name is required'),
  hostName: z.string().min(1, 'Host Name is required'),
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  encryption: z.string().min(1, 'Encryption is required'),
  port: z.string().min(1, 'Port No is required'),
  forSending: z.string().min(1, 'For Sending is required'),
  senderEmail: z.string().email('Must be a valid email').min(1, 'Sender Email is required'),
  senderName: z.string().min(1, 'Sender Name is required'),
}))

const { handleSubmit, validate } = useForm({
  validationSchema: formSchema,
})

const showVerifiedDialog = ref(false)
const showFailedDialog = ref(false)

async function checkSettings() {
  const { valid } = await validate()
  if (valid)
    showVerifiedDialog.value = true
  else showFailedDialog.value = true
}

const router = useRouter()
const route = useRoute()
const isEditMode = computed(() => route.query.mode === 'edit')

const onSubmit = handleSubmit((values) => {
  console.log('Form Submitted:', values)
  router.push('/app/configuration/smtp-settings')
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <div class="flex items-center gap-x-2">
        <BreadcrumbItem>
          <BreadcrumbLink href="/app/configuration/smtp-settings" class="font-normal">
            SMTP Settings
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>
            {{ isEditMode ? 'Edit SMTP' : 'Add SMTP' }}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </div>
    </BreadcrumbList>
  </Breadcrumb>
  <BaseHeader :title="isEditMode ? 'Edit SMTP' : 'Add SMTP'" />

  <Verified v-model:open="showVerifiedDialog" @close="showVerifiedDialog = false" />
  <Failed v-model:open="showFailedDialog" @close="showFailedDialog = false" />

  <!-- Place this inside your <template> where the <form> starts -->
  <form class="w-full  relative h-full border border-gray-200 rounded-xl py-6 flex flex-col gap-4 pb-4" @submit.prevent="onSubmit">
    <div class="flex items-center justify-between px-6">
      <h2 class="text-lg font-semibold text-primary">
        SMTP Details
      </h2>
    </div>

    <Separator />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-6">
      <!-- DRIVER NAME -->
      <FormField v-slot="{ componentField }" name="driverName">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            Driver Name
          </FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger class="w-full !h-11">
                <SelectValue placeholder="Select Driver Name" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem v-for="item in driverOptions" :key="item" :value="item">
                {{ item }}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>

      <!-- HOST NAME -->
      <FormField v-slot="{ componentField }" name="hostName">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            Host Name
          </FormLabel>
          <FormControl>
            <Input class="py-5" placeholder="Enter Host Name" v-bind="componentField" />
          </FormControl>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>

      <!-- USERNAME -->
      <FormField v-slot="{ componentField }" name="username">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            Username
          </FormLabel>
          <FormControl>
            <Input class="py-5" placeholder="Enter Username" v-bind="componentField" />
          </FormControl>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>

      <!-- PASSWORD -->
      <FormField v-slot="{ componentField }" name="password">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            Password
          </FormLabel>
          <FormControl>
            <Input class="py-5" type="password" placeholder="Enter Password" v-bind="componentField" />
          </FormControl>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>

      <!-- ENCRYPTION -->
      <FormField v-slot="{ componentField }" name="encryption">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            Encryption Type
          </FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger class="w-full !h-11">
                <SelectValue placeholder="Select Encryption Type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem v-for="enc in encryptionOptions" :key="enc" :value="enc">
                {{ enc }}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>

      <!-- PORT -->
      <FormField v-slot="{ componentField }" name="port">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            Port No
          </FormLabel>
          <FormControl>
            <Input class="py-5" placeholder="Enter Port No" v-bind="componentField" />
          </FormControl>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>

      <!-- FOR SENDING -->
      <FormField v-slot="{ componentField }" name="forSending">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            For Sending
          </FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger class="w-full !h-11">
                <SelectValue placeholder="Select Email Type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem v-for="type in emailTypeOptions" :key="type" :value="type">
                {{ type }}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>

      <!-- SENDER EMAIL -->
      <FormField v-slot="{ componentField }" name="senderEmail">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            Sender Email
          </FormLabel>
          <FormControl>
            <Input class="py-5" placeholder="Enter Email" v-bind="componentField" />
          </FormControl>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>

      <!-- SENDER NAME -->
      <FormField v-slot="{ componentField }" name="senderName">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="text-sm font-medium text-primary">
            Sender Name
          </FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger class="w-full !h-11">
                <SelectValue placeholder="Select Sender Name" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem v-for="name in senderNameOptions" :key="name" :value="name">
                {{ name }}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage class="text-xs text-red-500 mt-1" />
        </FormItem>
      </FormField>
    </div>

    <!-- Action Buttons -->
    <div class="absolute rounded-b-xl bottom-0 left-0 w-full grid grid-cols-1 md:grid-cols-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] bg-white border-t border-gray-200 p-7 z-10 gap-4">
      <!-- Check Settings Button -->
      <Button
        type="button"
        variant="outline"
        class="w-full py-6 text-md flex items-center justify-center gap-2 border border-[#162D3A] text-gray-700 hover:bg-gray-100"
        @click="checkSettings"
      >
        Check Setting
      </Button>

      <!-- Save Button -->
      <Button
        type="submit"
        class="w-full bg-[#162D3A] py-6 text-md text-white flex items-center justify-center gap-2 hover:bg-[#162D3A] hover:text-white"
      >
        <Icon name="material-symbols:save" />
        Save
      </Button>
    </div>
  </form>
</template>
