<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'

import { useForm } from 'vee-validate'

import * as z from 'zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from '@/components/ui/select'

import { Button } from '~/components/ui/button'

import { Input } from '~/components/ui/input'

const CallerIds = [
  {
    id: 1,
    name: 'Custom',
  },
  {
    id: 2,
    name: 'Area Code',
  },
  {
    id: 3,
    name: 'Area Code and Randomizer',
  },
]
const dialingModes = [
  {
    id: 1,
    name: 'Super Power Dial',
  },
  {
    id: 2,
    name: 'Predictive Dial',
  },
  {
    id: 3,
    name: 'Outbound Dial',
  },
]

const formSchema = toTypedSchema(z.object({
  callerId: z.number().min(1, 'required'),
  customCallerId: z.string().min(1, 'required').max(50).optional().superRefine((val, ctx) => {
    if (values.callerId === 1 && !val) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Custom Caller Is is required when Caller Is is Custom',
      })
    }
  }),
  dialingMode: z.number().min(1, 'required'),
  callerGroup: z.string().min(1, 'required').max(50),
}))

const { handleSubmit, resetForm, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    callerGroup: 'group-1',
    dialingMode: 1,
    customCallerId: 'custom-1',
    callerId: 1,
  },
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
})
const enableEdit = ref(false)
</script>

<template>
  <form action="">
    <div class="border rounded-lg bg-white">
      <div class="border-b px-5 pt-5 pb-3 flex items-center justify-between">
        <div class="text-[16px] font-medium text-primary/100">
          Caller Details
        </div>
        <div v-if="!enableEdit" class="flex items-center gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="enableEdit = true">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
        <div v-else class="flex gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="enableEdit = false ; resetForm()">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button class="w-[105px] rounded" size="sm" @click="onSubmit">
            <Icon name="material-symbols:save-rounded" />
            Save
          </Button>
        </div>
      </div>
      <div class="p-5 space-y-5 w-full">
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="callerId">
              <FormItem>
                <FormLabel class="font-normal text-xs" :class="!enableEdit && 'text-gray-500'">
                  Caller Id
                </FormLabel>
                <FormControl>
                  <Select v-if="enableEdit" v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-xs placeholder:text-[#ef698180]" placeholder="Select Caller Id" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in CallerIds" :key="item.id" :value="item.id">
                          {{ item.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div v-else class="text-[16px] font-normal text-primary">
                    {{ CallerIds.find(el => el.id === values.callerId)?.name }}
                  </div>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="customCallerId">
              <FormItem>
                <FormLabel class="font-normal text-xs" :class="!enableEdit && 'text-gray-500'">
                  Custom Caller Id
                </FormLabel>
                <FormControl>
                  <Select v-if="enableEdit" v-bind="componentField">
                    <SelectTrigger :disabled="values.callerId !== 1" class="w-full !h-11">
                      <SelectValue class="text-xs placeholder:text-[#ef698180]" placeholder="Select Custom Caller Id" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="i in 3" :key="i" :value="`custom-${i}`">
                          Custom ID {{ i }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div v-else class="text-[16px] font-normal text-primary">
                    {{ `Custom ID ${values.customCallerId?.split('-')[1]}` }}
                  </div>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
        </div>
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="dialingMode">
              <FormItem>
                <FormLabel class="font-normal text-xs" :class="!enableEdit && 'text-gray-500'">
                  Dialing Mode
                </FormLabel>
                <FormControl>
                  <Select v-if="enableEdit" v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-xs placeholder:text-[#ef698180]" placeholder="Select Dialing Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in dialingModes" :key="item.id" :value="item.id">
                          {{ item.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div v-else class="text-[16px] font-normal text-primary">
                    {{ dialingModes.find(el => el.id === values.dialingMode)?.name }}
                  </div>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="callerGroup">
              <FormItem>
                <FormLabel class="font-normal text-xs" :class="!enableEdit && 'text-gray-500'">
                  Caller Group
                </FormLabel>
                <FormControl>
                  <Select v-if="enableEdit" v-bind="componentField">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-xs placeholder:text-[#ef698180]" placeholder="Select Caller Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="i in 3" :key="i" :value="`group-${i}`">
                          Caller Group {{ i }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div v-else class="text-[16px] font-normal text-primary">
                    {{ `Caller Group ${values.callerGroup?.split('-')[1]}` }}
                  </div>
                </FormControl>
                <FormMessage class="text-xs" />
              </FormItem>
            </FormField>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
