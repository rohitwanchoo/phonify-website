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

const emit = defineEmits(['update:open', 'submit'])

const loading = ref(false)
const isEditMode = computed(() => !!props.rowData)

// SIP Trunk Provider options
const sipTrunkProviders = [
  { value: 'TWILIO', label: 'Twilio' },
  { value: 'PLIVO', label: 'Plivo' },
  { value: 'BANDWIDTH', label: 'Bandwidth' },
]

// Watch for changes in the open prop to handle form initialization
watch(() => props.open, (val) => {
  if (val) {
    if (isEditMode.value && props.rowData) {
      resetForm({
        values: {
          clientName: props.rowData.title || '',
          sipTrunkName: props.rowData.group_id || '',
          host: props.rowData.host || '',
          sipTrunkUserName: props.rowData.sipTrunkUserName || '',
          sipTrunkPassword: props.rowData.sipTrunkPassword || '',
          sipTrunkProvider: props.rowData.sipTrunkProvider || '',
        },
      })
    }
    else {
      resetForm()
    }
  }
})

// Form validation schema
const formSchema = toTypedSchema(z.object({
  clientName: z.string().min(1, 'Client name is required').max(100),
  sipTrunkName: z.string().min(1, 'SIP trunk name is required').max(100),
  host: z.string().min(1, 'Host is required').max(100),
  sipTrunkUserName: z.string().min(1, 'SIP trunk username is required').max(100),
  sipTrunkPassword: z.string().min(1, 'SIP trunk password is required').max(100),
  sipTrunkProvider: z.string().min(1, 'SIP trunk provider is required'),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    clientName: '',
    sipTrunkName: '',
    host: '',
    sipTrunkUserName: '',
    sipTrunkPassword: '',
    sipTrunkProvider: '',
  },
})

const onSubmit = handleSubmit((values) => {
  loading.value = true
  loading.value = false
  emit('update:open', false)
})
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ isEditMode ? 'Edit SIP Gateway' : 'Add SIP Gateway' }}
        </DialogTitle>
      </DialogHeader>
      <form class="space-y-4 py-4" @submit.prevent="onSubmit">
        <FormField v-slot="{ componentField }" name="clientName">
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

        <FormField v-slot="{ componentField }" name="sipTrunkName">
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

        <FormField v-slot="{ componentField }" name="host">
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

        <FormField v-slot="{ componentField }" name="sipTrunkUserName">
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

        <FormField v-slot="{ componentField }" name="sipTrunkPassword">
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

        <FormField v-slot="{ componentField }" name="sipTrunkProvider">
          <FormItem>
            <p class="text-primary text-sm">
              SIP Trunk Provider
            </p>
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger class="h-11 w-full">
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
            class="w-[50%] border-red-500 text-red-500 bg-red-50 hover:bg-white hover:text-red-500"
            @click="emit('update:open', false)"
          >
            <Icon name="material-symbols:close" />
            Discard
          </Button>
          <Button
            type="submit"
            class="w-[50%]"
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
