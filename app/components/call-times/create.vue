<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { FieldArray, useForm } from 'vee-validate'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

import { Separator } from '@/components/ui/separator'

const selectedDays = ref({
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
})

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'required').max(50),
  weeks: z.array(
    z.object({
      day: z.string(),
      start: z.string(),
      stop: z.string(),
    }),
  ).superRefine((weeks, ctx) => {
    const selected = selectedDays.value
    weeks.forEach((week, index) => {
      const isSelected = selected[week.day]

      // Only validate if checkbox is selected
      if (isSelected) {
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(week.start)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'start time required',
            path: [index, 'start'],
          })
        }

        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(week.stop)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'stop time required',
            path: [index, 'stop'],
          })
        }
      }
    })
  }),
}))

const initialValues = ref({
  title: '',
  weeks: [
    { day: 'default', start: '', stop: '' },
    { day: 'sunday', start: '', stop: '' },
    { day: 'monday', start: '', stop: '' },
    { day: 'tuesday', start: '', stop: '' },
    { day: 'wednesday', start: '', stop: '' },
    { day: 'thursday', start: '', stop: '' },
    { day: 'friday', start: '', stop: '' },
    { day: 'saturday', start: '', stop: '' },
  ],
})

const { handleSubmit, validate, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: initialValues.value,
})

function toggleDay(day: string) {
  selectedDays.value[day] = !selectedDays.value[day]
  // if any day is deselected validate the form
  if (!Object.values(selectedDays.value).includes(true)) {
    validate()
  }
}

const onSubmit = handleSubmit((values) => {
  console.log(values)
})
</script>

<template>
  <!-- reset form when dialog close -->
  <Dialog @update:open="(val) => { if (val) resetForm() }">
    <DialogTrigger as-child>
      <slot>
        <Button class="">
          <Icon class="!text-white" name="lucide:plus" />
          Create Call Time
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[715px] [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex items-center justify-between">
          Create Call Time
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
            name="title"
          >
            <FormItem>
              <FormLabel class="text-xs font-normal">
                Title
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter call time name" v-bind="componentField" class="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div class="space-y-3">
            <FieldArray v-slot="{ fields }" name="weeks">
              <div
                v-for="(field, index) in fields"
                :key="`weeks-${field.key}`"
                class="flex w-full justify-between flex-wrap"
              >
                <div class="flex items-center gap-x-3">
                  <!-- Static checkbox, not part of form -->
                  <Checkbox
                    :id="field.key"
                    class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    :checked="selectedDays[field.value.day]"
                    @update:model-value="() => { toggleDay(field.value.day) }"
                  />
                  <label :for="field.key" class="capitalize">
                    {{ field.value.day }}
                  </label>
                </div>

                <div class="flex w-full gap-x-2 max-w-[519px]">
                  <div class="w-full">
                    <FormField v-slot="{ componentField }" :name="`weeks[${index}].start`">
                      <FormItem>
                        <FormControl>
                          <Input
                            v-bind="componentField"
                            type="time"
                            class="h-11"
                            :disabled="!selectedDays[field.value.day]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                  <div class="w-full">
                    <FormField v-slot="{ componentField }" :name="`weeks[${index}].stop`">
                      <FormItem>
                        <FormControl>
                          <Input
                            type="time"
                            class="h-11"
                            v-bind="componentField"
                            :disabled="!selectedDays[field.value.day]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </div>
              </div>
            </FieldArray>
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
