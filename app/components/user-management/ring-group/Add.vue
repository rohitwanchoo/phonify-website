<script setup lang="ts">
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
  name: z.string().min(1, 'required').max(50),
  description: z.string().min(1, 'required').max(255),
  extension: z.number().min(1, 'required'),
  email: z.string().email().min(1, 'required').max(50),
  ring_mode: z.number().min(1,'required'),
  receive_on: z.string().min(1, 'required'),

}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
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
        <DialogTitle class="text-[16px] font-medium flex items-center justify-between">
          Add Ring Group
          <DialogClose class="cursor-pointer">
            <Icon name="mdi:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>
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
            v-slot="{ componentField }"
            name="extension"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Description
              </FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11 ">
                    <SelectValue class="text-xs" placeholder="Select extension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in Extensions" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
</template>
