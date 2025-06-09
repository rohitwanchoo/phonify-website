<script setup lang="ts">
import type { Extension } from '~/types/extension'
import { toTypedSchema } from '@vee-validate/zod'

import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { Label } from '@/components/ui/label'
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

const formSchema = toTypedSchema(z.object({
  name: z.string().min(1, 'name is required').max(50, 'max'),
  description: z.string().min(1, 'description is required').max(250, 'max'),
  extension: z.array(
    z.object({
      extension: z.number(),
      first_name: z.string(),
      last_name: z.string(),
    }),
  ).min(1, 'at least one extension is required'),
  email: z.string().email().min(1, 'email is required').max(50),
  ring_mode: z.number().min(1, ' ring mode is required'),
  receive_on: z.string().min(1, 'receive is required'),

}))

const { handleSubmit, errors } = useForm({
  validationSchema: formSchema,
})
const onSubmit = handleSubmit((values) => {
  // Handle form submission
  console.log(values)
})

const Extensions = [
  {
    id: 1,
    name: 'Extension 1',
    code: 'EXT123',
  },
  {
    id: 2,
    name: 'Extension 2',
    code: 'EXT456',
  },
  {
    id: 3,
    name: 'Extension 3',
    code: 'EXT789',
  },
]
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

const addExtensionSheet = ref(false)

const selectedExtensions = ref<Extension[]>([])

function removeExtension(index: number) {
  selectedExtensions.value.splice(index, 1)
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="!text-white" name="lucide:plus" />
          Add Ring Group
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex justify-between">
          Add Ring Group
          <DialogClose class="cursor-pointer flex items-center">
            <Icon name="mdi:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>
      <!-- {{ selectedExtensions }} -->
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField
            v-slot="{ componentField }"
            name="name"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Name
              </FormLabel>
              <FormControl>
                <Input v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="description"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Description
              </FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" class="max-h-[200px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField
            v-model="selectedExtensions"
            name="extension"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Extensions
              </FormLabel>
              <FormControl>
                <div :class="errors.extension && 'border-red-600'" class="p-4 text-xs text-gray-500 flex items-center border rounded-lg cursor-pointer">
                  <div v-if="!selectedExtensions.length" class="hover:text-primary" @click="addExtensionSheet = true">
                    Select extensions
                  </div>
                  <ul v-else v-auto-animate class="flex gap-2 items-center flex-wrap">
                    <li v-for="(item, index) in selectedExtensions" :key="item.extension" class="border py-[3px] px-[5px] rounded-[6px] text-xs text-primary border-[#00A086] bg-[#00A0861A] flex items-center gap-x-1 text-nowrap">
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
            name="email"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                email
              </FormLabel>
              <FormControl>
                <Input v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <div class="grid grid-cols-2 gap-x-2">
            <div>
              <FormField
                v-slot="{ componentField }"
                name="ring_mode"
              >
                <FormItem>
                  <FormLabel class="text-xs font-normal">
                    Ring Mode
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="w-full !h-11 ">
                        <SelectValue class="text-xs" placeholder="Select ring mode" />
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
                  <FormLabel class="text-xs font-normal">
                    Receive On
                  </FormLabel>
                  <FormControl>
                    <Select v-bind="componentField">
                      <SelectTrigger class="w-full !h-11 ">
                        <SelectValue class="text-xs" placeholder="Select received on" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="item in ['Desk Phone', 'Web Phone', 'Mobile']" :key="item" :value="item">
                            {{ item }}
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
            <DialogClose class="w-1/2">
              <Button variant="outline" class="h-11  w-full">
                <Icon name="mdi:close" />
                Close
              </Button>
            </DialogClose>
            <Button for="form" class="h-11 w-1/2" type="submit" @click="onSubmit">
              <Icon name="material-symbols:save" size="18" />
              Save
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
