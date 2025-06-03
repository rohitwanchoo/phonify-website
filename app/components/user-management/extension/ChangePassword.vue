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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

const emits = defineEmits(['save'])

const formSchema = toTypedSchema(z.object({
  password: z.string().min(2, 'new password is required').max(10, '10 characters maximum'),
}))
const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

// function onSubmit() {
//   showToast({
//     message: 'You submitted the following values:',
//   })
// }
const showPassword = ref(false)
const open = defineModel<boolean>()

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted!', values)
  emits('save')
})
</script>

<template>
  <form as="" keep-values>
    <Dialog v-model:open="open">
      <DialogContent class="sm:max-w-[425px] [&>button]:hidden ">
        <DialogHeader class="mb-4">
          <DialogTitle class="text-[16px] font-normal flex justify-between items-center border-b pb-[17.5px]">
            Change Password
            <DialogClose>
              <Icon name="material-symbols:close" size="20" />
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <form id="dialogForm">
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel class="font-normal">
                New Password
              </FormLabel>
              <FormControl>
                <div class="relative">
                  <Input :type="showPassword ? 'text' : 'password'" class="h-11" placeholder="New Password" v-bind="componentField" />
                  <Icon class="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer" size="20" :name="!showPassword ? 'material-symbols:visibility-outline' : 'material-symbols:visibility-off-outline'" @click="showPassword = !showPassword" />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter class="mt-4">
          <DialogClose class="w-[49%]">
            <Button variant="outline" class="w-full h-11" type="submit" form="dialogForm">
              <Icon name="material-symbols:close" />
              Close
            </Button>
          </DialogClose>

          <Button class="w-[49%] h-11" type="submit" form="dialogForm" @click="onSubmit">
            <Icon name="material-symbols:save" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </form>
</template>
