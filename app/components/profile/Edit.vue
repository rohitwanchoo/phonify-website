<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const profileSchema = toTypedSchema(z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  company: z.string().optional(),
  address1: z.string().min(1, 'Required'),
  address2: z.string().optional(),
  phone: z.string().min(6, 'Invalid phone'),
  timeZone: z.string().min(1, 'Select a time zone'),
}))

const { handleSubmit } = useForm({
  validationSchema: profileSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Submitted values:', values)
})
</script>

<template>
  <div class="relative h-full max-w-2xl mx-auto rounded-lg overflow-hidden flex flex-col">
    <!-- Scrollable Form Content -->
    <Form class="flex-1 overflow-auto py-2 space-y-4" @submit="onSubmit">
      <!-- First Name -->
      <FormField v-slot="{ componentField }" name="firstName">
        <FormItem>
          <FormLabel>First Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="John" class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Last Name -->
      <FormField v-slot="{ componentField }" name="lastName">
        <FormItem>
          <FormLabel>Last Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Doe" class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Email -->
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="email" placeholder="john@example.com" class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Company -->
      <FormField v-slot="{ componentField }" name="company">
        <FormItem>
          <FormLabel>Company Name</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Acme Inc." class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Phone -->
      <FormField v-slot="{ componentField }" name="phone">
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="+1 555-123-4567" class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Address 1 -->
      <FormField v-slot="{ componentField }" name="address1">
        <FormItem>
          <FormLabel>Address Line 1</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="123 Main Street" class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Address 2 -->
      <FormField v-slot="{ componentField }" name="address2">
        <FormItem>
          <FormLabel>Address Line 2</FormLabel>
          <FormControl>
            <Input v-bind="componentField" placeholder="Apt 4B" class="w-full" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <!-- Timezone -->
      <FormField v-slot="{ componentField }" name="timeZone">
        <FormItem>
          <FormLabel>Time Zone</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select time zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">
                  UTC
                </SelectItem>
                <SelectItem value="America/New_York">
                  America/New_York
                </SelectItem>
                <SelectItem value="Asia/Kolkata">
                  Asia/Kolkata
                </SelectItem>
                <SelectItem value="Europe/Berlin">
                  Europe/Berlin
                </SelectItem>
                <SelectItem value="Australia/Sydney">
                  Australia/Sydney
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </Form>

    <!-- Sticky Submit Button -->
    <div class="sticky bottom-0 left-0 right-0 bg-white border-t px-4 py-3">
      <Button type="submit" form="form" class="w-full">
        Update
      </Button>
    </div>
  </div>
</template>
