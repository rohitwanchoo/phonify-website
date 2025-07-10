<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm,useField } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const dialogOpen = ref(false)
const secondDialogOpen = ref(false)
const loading = ref(false)
const formData = ref<any>(null)


function onDialogOpen(val: boolean) {
  if (val)
    resetForm()
}

const formSchema = toTypedSchema(z.object({
  campaignName: z.string().min(1, 'Campaign name is required').max(100),
  message: z.string().min(1, 'Message is required').max(500),
  phoneNumbers: z.string().min(1, 'Phone numbers are required'),
  scheduleType: z.enum(["immediate", "scheduled"]),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
}))

const { handleSubmit, resetForm, setFieldError } = useForm({
  validationSchema: formSchema,
  initialValues: {
    campaignName: '',
    message: '',
    phoneNumbers: '',
    scheduleType: 'immediate',
    scheduleDate: '',
    scheduleTime: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store form data and open second dialog
    formData.value = values
    dialogOpen.value = false
    secondDialogOpen.value = true
    
    showToast({
      message: 'Form submitted successfully',
      type: 'success',
    })
  }
  catch (error: any) {
    handleFieldErrors(error?.data, setFieldError)
    showToast({
      message: error?._data?.message || 'Failed to submit form',
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})

const { setValue: setFile } = useField('file')

function handleFileUpdate(files: File[]) {
  setFile(files)
}

function onSecondDialogClose() {
  secondDialogOpen.value = false
  resetForm()
}
</script>

<template>
  <Dialog v-model:open="dialogOpen" @update:open="onDialogOpen">
    <DialogTrigger as-child>
      <Button>
        <Icon class="!text-white" name="lucide:plus" />
        Create Ringless Campaign
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Ringless List</DialogTitle>
      </DialogHeader>
      <form class="space-y-4 py-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="campaignName">
          <FormItem>
            <p class="text-primary text-sm">
              Title
            </p>
            <FormControl>
              <Input placeholder="Enter campaign name" class="h-11" v-bind="componentField" />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>
        <BaseFileUploader accept=".xlc,.xlxs,.csv" max-size="5MB" @update:files="handleFileUpdate" />

        <FormField v-slot="{ componentField }" name="phoneNumbers">
          <FormItem>
            <p class="text-primary text-sm">
              Campaign
            </p>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="h-11 w-full">
                  <SelectValue placeholder="Select a campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="summer-sale">
                      Summer Sale Promotion
                    </SelectItem>
                    <SelectItem value="new-product">
                      New Product Launch
                    </SelectItem>
                    <SelectItem value="holiday-special">
                      Holiday Special Offer
                    </SelectItem>
                    <SelectItem value="customer-retention">
                      Customer Retention Program
                    </SelectItem>
                    <SelectItem value="referral-bonus">
                      Referral Bonus Campaign
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <DialogFooter class="pt-4">
          <Button type="button" class="w-[50%] border-red-500 text-red-500 bg-red-50 hover:bg-white hover:text-red-500" variant="outline" @click="resetForm">
            <Icon name="material-symbols:close" />
            Discard
          </Button>
          <Button type="submit" class="w-[50%]" :disabled="loading" :loading="loading">
            <Icon name="material-symbols:check" />
            Next
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <!-- Second Dialog -->
  <Dialog v-model:open="secondDialogOpen" @update:open="onSecondDialogClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Review Campaign Details</DialogTitle>
      </DialogHeader>
      <div class="space-y-4 py-4">
        <div v-if="formData">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Campaign Name:</p>
              <p class="font-medium">{{ formData.campaignName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Campaign Type:</p>
              <p class="font-medium">{{ formData.phoneNumbers }}</p>
            </div>
          </div>
          
          <div class="mt-4">
            <p class="text-sm text-gray-500">Message:</p>
            <p class="font-medium">{{ formData.message }}</p>
          </div>
          
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Schedule Type:</p>
              <p class="font-medium">{{ formData.scheduleType === 'immediate' ? 'Immediate' : 'Scheduled' }}</p>
            </div>
            <div v-if="formData.scheduleType === 'scheduled'">
              <p class="text-sm text-gray-500">Scheduled Time:</p>
              <p class="font-medium">{{ formData.scheduleDate }} {{ formData.scheduleTime }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <p class="text-sm font-medium mb-2">Uploaded File:</p>
          <div class="border rounded-md p-3 bg-gray-50">
            <div class="flex items-center">
              <Icon name="heroicons:document" class="w-5 h-5 text-gray-400 mr-2" />
              <span class="text-sm">contacts_list.xlsx</span>
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter class="pt-4">
        <Button type="button" class="w-[50%] border-gray-300 text-gray-700 bg-gray-50 hover:bg-white" variant="outline" @click="secondDialogOpen = false">
          <Icon name="material-symbols:arrow-back" />
          Back
        </Button>
        <Button type="button" class="w-[50%]" @click="secondDialogOpen = false">
          <Icon name="material-symbols:check-circle" />
          Confirm & Create
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>