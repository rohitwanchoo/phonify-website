<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { FormControl, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

const props = defineProps<{
  open: boolean
  rowData?: any
}>()

const emits = defineEmits(['update:open', 'refresh'])

const loading = ref(false)
const isEditMode = computed(() => !!props.rowData)
const formSchema = toTypedSchema(z.object({
  client_name: z.string().min(1, 'Client name is required').max(100),
  sip_trunk_name: z.string().min(1, 'SIP trunk name is required').max(100),
  sip_trunk_host: z.string().min(1, 'Host is required').max(100),
  sip_trunk_username: z.string().min(1, 'SIP trunk username is required').max(100),
  sip_trunk_password: z.string().min(1, 'SIP trunk password is required').max(100),
  sip_trunk_provider: z.string().min(1, 'SIP trunk provider is required'),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    client_name: '',
    sip_trunk_name: '',
    sip_trunk_host: '',
    sip_trunk_username: '',
    sip_trunk_password: '',
    sip_trunk_provider: '',
  },
})

// SIP Trunk Provider options
const sipTrunkProviders = [
  { value: 'twilio', label: 'Twilio' },
  { value: 'plivo', label: 'Plivo' },
]

// Watch for changes in the open prop to handle form initialization
watch(() => props.open, (val) => {
  if (val) {
    if (isEditMode.value && props.rowData) {
      resetForm({
        values: {
          client_name: props.rowData.client_name || '',
          sip_trunk_name: props.rowData.sip_trunk_name || '',
          sip_trunk_host: props.rowData.sip_trunk_host || '',
          sip_trunk_username: props.rowData.sip_trunk_username || '',
          sip_trunk_password: props.rowData.sip_trunk_password || '',
          sip_trunk_provider: props.rowData.sip_trunk_provider || '',
        },
      })
    }
    else {
      resetForm()
    }
  }
})

const onSubmit = handleSubmit(async (values) => {
  loading.value = true

  try {
    let res
    if (isEditMode.value && props.rowData) {
      res = await useApi().post('/update-sip-gateways', {
        ...values,
        sip_id: props.rowData.id, // Include the sip ID for update
      })
    }
    else {
      // Add mode
      res = await useApi().put('/sip-gateway', values)
    }

    if (res.success) {
      showToast({
        message: res.message,
        type: 'success',
      })
      emits('update:open', false) // Close the dialog on success
      emits('refresh')
    }
    else {
      showToast({
        message: res.message || 'Failed to delete campaign',
        type: 'error',
      })
    }
  }
  catch (err) {
    showToast({
      message: `${err}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emits('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? 'Edit SIP Gateway' : 'Add SIP Gateway' }}
        </DialogTitle>
      </DialogHeader>
      <form class="space-y-4 py-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="client_name">
          <FormItem>
            <p class="text-primary text-sm">
              Client Name
            </p>
            <FormControl>
              <Input
                placeholder="Enter client name"
                class="h-11"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="sip_trunk_name">
          <FormItem>
            <p class="text-primary text-sm">
              SIP Trunk Name
            </p>
            <FormControl>
              <Input
                placeholder="Enter SIP trunk name"
                class="h-11"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="sip_trunk_host">
          <FormItem>
            <p class="text-primary text-sm">
              Host
            </p>
            <FormControl>
              <Input
                placeholder="Enter host"
                class="h-11"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="sip_trunk_username">
          <FormItem>
            <p class="text-primary text-sm">
              SIP Trunk User Name
            </p>
            <FormControl>
              <Input
                placeholder="Enter SIP trunk username"
                class="h-11"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="sip_trunk_password">
          <FormItem>
            <p class="text-primary text-sm">
              SIP Trunk Password
            </p>
            <FormControl>
              <Input
                type="password"
                placeholder="Enter SIP trunk password"
                class="h-11"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="sip_trunk_provider">
          <FormItem>
            <p class="text-primary text-sm">
              SIP Trunk Provider
            </p>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="!h-11 w-full">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="provider in sipTrunkProviders" :key="provider.value" :value="provider.value">
                    {{ provider.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage class="ml-2 text-xs" />
          </FormItem>
        </FormField>

        <DialogFooter class="pt-4">
          <Button
            type="button"
            variant="outline"
            class="w-[50%] h-11 border-red-500 text-red-500 bg-red-50 hover:bg-white hover:text-red-500"
            @click="emits('update:open', false)"
          >
            <Icon name="material-symbols:close" />
            Discard
          </Button>
          <Button
            type="submit"
            class="w-[50%] h-11"
            :disabled="loading"
          >
            <Icon name="material-symbols:check" />
            {{ loading ? 'Saving...' : isEditMode ? 'Update' : 'Save' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
