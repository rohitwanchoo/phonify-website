<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as z from 'zod'

import Failed from '@/components/configuration/smtp-settings/Failed.vue'
import Verified from '@/components/configuration/smtp-settings/Verified.vue'

import { Button } from '~/components/ui/button'
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

const router = useRouter()

const driverOptions = [{
  title: 'SMTP',
  value: 'smtp',
}]
const encryptionOptions = ['TLS', 'SSL']
const senderType = [
  {
    title: 'System Emails',
    value: 'system',
  },
  {
    title: 'Campaign Emails',
    value: 'campaign',
  },
  {
    title: 'User Emails',
    value: 'user',
  },
]

const formSchema = toTypedSchema(z.object({
  mail_driver: z.string().min(1, 'Driver Name is required'),
  mail_host: z.string().min(1, 'Host Name is required'),
  mail_username: z.string().min(1, 'Username is required'),
  mail_password: z.string().min(1, 'Password is required'),
  mail_encryption: z.string().min(1, 'Encryption is required'),
  mail_port: z.string().min(1, 'Port No is required'),
  sender_type: z.string().min(1, 'For Sending is required'),
  from_email: z.string().email('Must be a valid email').min(1, 'Sender Email is required'),
  from_name: z.string().min(1, 'Sender Name is required'),
}))

const { handleSubmit, setValues, values } = useForm({
  validationSchema: formSchema,
})

const showVerifiedDialog = ref(false)
const showFailedDialog = ref(false)

const checkSettingsLoading = ref(false)

async function checkSettings() {
  checkSettingsLoading.value = true
  useApi().post('/checkSMTPSetting', values).then((response) => {
    showToast({ message: response.message })
    showVerifiedDialog.value = true
  }).catch(() => {
    // showToast({ type: 'error', message: error.message })
    showFailedDialog.value = true
  }).finally(() => {
    checkSettingsLoading.value = false
  })
  // const { valid } = await validate()
  // if (valid)
  //   showVerifiedDialog.value = true
  // else showFailedDialog.value = true
}

const route = useRoute()
const editId = computed(() => route.query.id)

const loading = ref(false)
const onSubmit = handleSubmit((values) => {
  loading.value = true
  useApi().post(`/smtp/${editId.value}`, values).then((response) => {
    showToast({ message: response.message })
    router.back()
  }).catch((error) => {
    showToast({
      type: 'error',
      message: error.message,
    })
  }).finally(() => {
    loading.value = false
  })
})

const breadcrumbs = ref([
  {
    label: 'SMTP Settings',
    href: '/app/configuration/company-settings',
  },
  {
    label: editId.value ? 'Edit SMTP' : 'Add SMTP',
    active: true,
  },
])

const fetchSmtpLoading = ref(false)
onMounted(() => {
  if (editId.value) {
    fetchSmtpLoading.value = true
    useApi().get(`/smtp/${editId.value}`).then(({ data }) => {
      setValues({
        mail_driver: data.mail_driver,
        mail_host: data.mail_host,
        mail_username: data.mail_username,
        mail_password: data.mail_password,
        mail_encryption: data.mail_encryption,
        mail_port: data.mail_port,
        sender_type: data.sender_type,
        from_email: data.from_email,
        from_name: data.from_name,
      })
    }).catch((error) => {
      showToast({
        type: 'error',
        message: error.message,
      })
    }).finally(() => {
      fetchSmtpLoading.value = false
    })
  }
})
</script>

<template>
  <BaseHeader :title="editId ? 'Edit SMTP' : 'Add SMTP'" :breadcrumbs />

  <Verified v-model:open="showVerifiedDialog" @close="showVerifiedDialog = false" />
  <Failed v-model:open="showFailedDialog" @close="showFailedDialog = false" />

  <form class="w-full relative h-[calc(100vh-190px)] border border-gray-200 rounded-xl flex flex-col overflow-hidden" @submit.prevent="onSubmit">
    <!-- Scrollable area: includes heading, separator, and fields -->
    <div class="overflow-y-auto flex-1 pb-40">
      <div class="flex items-center justify-between px-6 pt-6">
        <h2 class="text-lg font-semibold text-primary">
          SMTP Details
        </h2>
      </div>
      <Separator class="my-2" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 px-6 pt-2">
        <!-- DRIVER NAME -->
        <FormField v-slot="{ componentField }" name="mail_driver">
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
                <SelectItem v-for="item in driverOptions" :key="item.value" :value="item.value">
                  {{ item.title }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage class="text-xs text-red-500 mt-1" />
          </FormItem>
        </FormField>

        <!-- HOST NAME -->
        <FormField v-slot="{ componentField }" name="mail_host">
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
        <FormField v-slot="{ componentField }" name="mail_username">
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
        <FormField v-slot="{ componentField }" name="mail_password">
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
        <FormField v-slot="{ componentField }" name="mail_encryption">
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
        <FormField v-slot="{ componentField }" name="mail_port">
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
        <FormField v-slot="{ componentField }" name="sender_type">
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
                <SelectItem v-for="type in senderType" :key="type.value" :value="type.value">
                  {{ type.title }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage class="text-xs text-red-500 mt-1" />
          </FormItem>
        </FormField>

        <!-- SENDER EMAIL -->
        <FormField v-slot="{ componentField }" name="from_email">
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
        <FormField v-slot="{ componentField }" name="from_name">
          <FormItem class="flex flex-col gap-1 mb-8">
            <FormLabel class="text-sm font-medium text-primary">
              Sender Name
            </FormLabel>
            <Input class="py-5" placeholder="Sender Name" v-bind="componentField" />

            <FormMessage class="text-xs text-red-500 mt-1" />
          </FormItem>
        </FormField>
      </div>
    </div>

    <!-- Fixed Action Buttons -->
    <div class="absolute bottom-0 left-0 w-full grid grid-cols-1 md:grid-cols-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)] bg-white border-t border-gray-200 p-7 z-10 gap-4">
      <!-- Check Settings Button -->
      <Button
        type="button"
        variant="outline"
        class="w-full py-6 text-md flex items-center justify-center gap-2 border border-[#162D3A] text-gray-700 hover:bg-gray-100"
        :loading="checkSettingsLoading"
        @click="checkSettings"
      >
        Check Setting
      </Button>

      <!-- Save Button -->
      <Button
        type="submit"
        :disabled="fetchSmtpLoading"
        :loading
        class="w-full bg-[#162D3A] py-6 text-md text-white flex items-center justify-center gap-2 hover:bg-[#162D3A] hover:text-white"
      >
        <Icon name="material-symbols:save" />
        Save
      </Button>
    </div>
  </form>
</template>
