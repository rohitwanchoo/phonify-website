<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const schema = toTypedSchema(z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}))

const { handleSubmit } = useForm({
  validationSchema: schema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Password change values:', values)
})
</script>

<template>
  <div class="relative w-full h-full flex flex-col pt-2 overflow-hidden">
    <!-- Scrollable form -->
    <Form class="flex-1 overflow-auto space-y-4" @submit="onSubmit">
      <!-- Current Password -->
      <FormField v-slot="{ componentField }" name="currentPassword">
        <FormItem>
          <FormLabel>Current Password</FormLabel>
          <FormControl>
            <div class="relative">
              <Input
                v-bind="componentField"
                :type="showCurrent ? 'text' : 'password'"
                placeholder="Enter current password"
                class="w-full pr-10"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                @click="showCurrent = !showCurrent"
              >
                <Eye :class="showCurrent ? 'hidden' : ''" class="w-5 h-5" />
                <EyeOff :class="!showCurrent ? 'hidden' : ''" class="w-5 h-5" />
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- New Password -->
      <FormField v-slot="{ componentField }" name="newPassword">
        <FormItem>
          <FormLabel>New Password</FormLabel>
          <FormControl>
            <div class="relative">
              <Input
                v-bind="componentField"
                :type="showNew ? 'text' : 'password'"
                placeholder="Enter new password"
                class="w-full pr-10"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                @click="showNew = !showNew"
              >
                <Eye :class="showNew ? 'hidden' : ''" class="w-5 h-5" />
                <EyeOff :class="!showNew ? 'hidden' : ''" class="w-5 h-5" />
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Confirm Password -->
      <FormField v-slot="{ componentField }" name="confirmPassword">
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <div class="relative">
              <Input
                v-bind="componentField"
                :type="showConfirm ? 'text' : 'password'"
                placeholder="Confirm new password"
                class="w-full pr-10"
              />
              <button
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                @click="showConfirm = !showConfirm"
              >
                <Eye :class="showConfirm ? 'hidden' : ''" class="w-5 h-5" />
                <EyeOff :class="!showConfirm ? 'hidden' : ''" class="w-5 h-5" />
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </Form>

    <!-- Fixed Update Button -->
    <div class="sticky bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
      <Button type="submit" form="form" class="w-full">
        Update Password
      </Button>
    </div>
  </div>
</template>
