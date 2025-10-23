<script setup lang="ts">
import type { Extension } from '~/types/extension'
import { toTypedSchema } from '@vee-validate/zod'
import { useFocus } from '@vueuse/core'

import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import Textarea from '~/components/ui/textarea/Textarea.vue'

interface RingGroup {
  id: number
  title: string
  emails: string
  ring_type: number
  description: string
  receive_on: string
  extension_name: string
  extension_id: number[]
  extension: Extension[]
}

const props = defineProps<{
  tempRingGroup?: RingGroup
  isEdit?: boolean
}>()

const emits = defineEmits(['complete'])

const focusInput = shallowRef()
useFocus(focusInput, { initialValue: true })

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const addExtensionSheet = ref(false)

const selectedExtensions = ref<Extension[]>([])

function removeExtension(index: number) {
  selectedExtensions.value.splice(index, 1)
}

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'name is required').max(50, 'max'),
  description: z.string().min(1, 'description is required').max(250, 'max'),
  extension: z.array(
    z.object({
      extension: z.number(),
      first_name: z.string(),
      last_name: z.string(),
    }),
  ).min(1, 'at least one extension is required'),
  emails: z.string().email().min(1, 'email is required').max(50),
  ring_type: z.number().min(1, ' ring mode is required'),
  receive_on: z.string().min(1, 'receive is required'),

}))

const { handleSubmit, setFieldValue, setValues, resetForm } = useForm({
  validationSchema: formSchema,

})

watch(open, (newValue) => {
  if (newValue && props.isEdit && props.tempRingGroup) {
    setValues({...props.tempRingGroup})

    // Parse extension_name and extension_id to create extension objects
    if (props.tempRingGroup.extension_name && props.tempRingGroup.extension_id) {
      const extensionNames = props.tempRingGroup.extension_name.split(',')
      const extensionIds = props.tempRingGroup.extension_id

      const parsedExtensions = extensionNames.map((nameStr: string, index: number) => {
        // Parse "Name LastName-12345" format
        const parts = nameStr.trim().split('-')
        const extensionNum = parts[parts.length - 1]
        const fullName = parts.slice(0, -1).join('-').trim()
        const nameParts = fullName.split(' ')

        return {
          id: extensionIds[index],
          extension: Number(extensionNum),
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
        }
      })

      selectedExtensions.value = parsedExtensions as Extension[]
      setFieldValue('extension', parsedExtensions)
    }
    else {
      selectedExtensions.value = []
      setFieldValue('extension', [])
    }
  }
  else {
    // Reset form for new ring group
    setValues({
      title: '',
      description: '',
      emails: '',
      ring_type: 1,
      receive_on: '',
      extension: [],
    })
    resetForm()

    selectedExtensions.value = []
  }
})

const loading = ref(false)
const onSubmit = handleSubmit((values) => {
  loading.value = true
  const api = props.isEdit ? '/edit-ring-group' : '/add-ring-group'
  const payload = {
    ...values,
    emails: [values.emails],
    extension: values.extension.map((item: { extension: number }) => item.extension),
    ring_id: props.isEdit ? props.tempRingGroup?.id : undefined,
  }
  useApi().post(api, payload).then((res) => {
    if (res.success === 'true') {
      showToast({
        type: 'success',
        message: res.message,
      })
      loading.value = false
      emits('complete')
      open.value = false
    }
    else {
      showToast({
        type: 'error',
        message: res.message,
      })
    }
  }).catch((err) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  }).finally(() => {
    loading.value = false
  })
})

const ringModes = [
  {
    id: 1,
    name: 'Ring All',
  },
  {
    id: 2,
    name: 'Sequence',
  },
  {
    id: 3,
    name: 'Round Robin',
  },
]

const receiveOn = [
  {
    id: 'desk_phone',
    name: 'Desk Phone',
  },
  {
    id: 'web_phone',
    name: 'Web Phone',
  },
  {
    id: 'mobile',
    name: 'Mobile',
  },
]
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="text-xl" name="material-symbols:add" />
          Add Ring Group
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex justify-between">
          {{ isEdit ? 'Edit Ring Group' : 'Add Ring Group' }}
          <DialogClose class="cursor-pointer flex items-center">
            <Icon class="text-xl" name="material-symbols:close" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField
            v-slot="{ componentField }"
            name="title"
          >
            <FormItem>
              <FormLabel class="text-sm font-normal">
                Name
              </FormLabel>
              <FormControl>
                <Input ref="focusInput" v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="description"
          >
            <FormItem>
              <FormLabel class="text-sm font-normal">
                Description
              </FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" class="max-h-[200px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-slot="{ errorMessage }"
            v-model="selectedExtensions"
            name="extension"
          >
            <FormItem>
              <FormLabel class="text-sm font-normal">
                Extensions
              </FormLabel>
              <FormControl>
                <div :class="errorMessage && 'border-red-600'" class="p-4 text-sm text-gray-500 flex items-center border rounded-lg cursor-pointer">
                  <div v-if="!selectedExtensions.length" class="hover:text-primary" @click="addExtensionSheet = true">
                    Select extensions
                  </div>
                  <ul v-else v-auto-animate class="flex gap-2 items-center flex-wrap">
                    <li v-for="(item, index) in selectedExtensions" :key="item.extension" class="border py-[3px] px-[5px] rounded-[6px] text-sm text-primary border-[#00A086] bg-[#00A0861A] flex items-center gap-x-1 text-nowrap">
                      {{ item.first_name }} {{ item.last_name }} - {{ item.extension }}
                      <Icon size="14" name="lucide:x" class="" @click.stop="removeExtension(index)" />
                    </li>
                    <li class="hover:text-primary" @click="addExtensionSheet = true">
                      Add more..
                    </li>
                  </ul>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="emails"
          >
            <FormItem>
              <FormLabel class="text-sm font-normal">
                Email
              </FormLabel>
              <FormControl>
                <Input v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-2">
            <div>
              <FormField
                v-slot="{ componentField }"
                name="ring_type"
              >
                <FormItem>
                  <FormLabel class="text-sm font-normal">
                    Ring Mode
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="w-full !h-11 ">
                        <SelectValue class="text-sm" placeholder="Select ring mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="item in ringModes" :key="item.id" :value="item.id">
                            {{ item.name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div>
              <FormField
                v-slot="{ componentField }"
                name="receive_on"
              >
                <FormItem>
                  <FormLabel class="text-sm font-normal mt-4 md:mt-0">
                    Receive On
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="w-full !h-11 ">
                        <SelectValue class="text-sm" placeholder="Select received on" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="item in receiveOn" :key="item.id" :value="item.id">
                            {{ item.name }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>

          <DialogFooter>
            <DialogClose class="sm:w-1/2">
              <Button variant="outline" class="h-11  w-full">
                <Icon name="material-symbols:close" size="20" />
                Close
              </Button>
            </DialogClose>
            <Button :disabled="loading" for="form" class="h-11 sm:w-1/2" type="submit" :loading="loading" @click="onSubmit">
              <Icon name="material-symbols:save" size="20" />
              {{ isEdit ? 'Update' : 'Save' }}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>

  <UserManagementGroupAddExtension
    v-model="addExtensionSheet"
    v-model:selected-extensions="selectedExtensions"
    :show-button="false"
  />
</template>
