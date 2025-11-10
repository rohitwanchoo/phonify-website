<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const schema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    message: z.string().min(1, 'Message is required'),
  }),
)

const form = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  },
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form Submitted:', values)
})
</script>

<template>
  <section class="w-full bg-[#F9F9F9] overflow-hidden">
    <div class="flex flex-col md:flex-row w-full h-auto">
      <!-- LEFT IMAGE SECTION -->
      <div class="hidden md:flex md:w-1/2 justify-center items-center bg-white relative p-6 md:pl-[49px]">
        <div class="relative flex justify-center items-center">
          <img
            src="/images/phonify-web/contact-us/small-transaction.png" alt="Dashboard preview"
            class="w-[600px] h-auto  object-contain"
          >
        </div>
      </div>
      <div
        class="w-full md:w-1/2 flex flex-col justify-center bg-[#F9F9F9] py-10 px-4 sm:px-8 md:py-[100px] "
      >
        <div class="flex flex-col gap-3 mb-6 text-left">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-900">
            Get in touch with us
          </h2>
          <p class="text-gray-600 text-base md:text-lg font-light leading-relaxed">
            Boost agent productivity and efficiency with our advanced dialer that automates
            and streamlines outbound calls.
          </p>
        </div>

        <form class="flex flex-col gap-4 md:gap-5" @submit="onSubmit">
          <div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem class="flex flex-col min-h-[84px]">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text" placeholder="Enter your first name" v-bind="componentField"
                      class="border border-[#CACACA] rounded-xs bg-[#F4F4F6] p-3 text-sm"
                    />
                  </FormControl>
                  <FormMessage class="min-h-[20px]" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem class="flex flex-col min-h-[84px]">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text" placeholder="Enter your last name" v-bind="componentField"
                      class="border border-[#CACACA] rounded-xs bg-[#F4F4F6] p-3 text-sm"
                    />
                  </FormControl>
                  <FormMessage class="min-h-[20px]" />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem class="mt-4">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email" placeholder="Enter your email address" v-bind="componentField"
                    class="border border-[#CACACA] rounded-xs bg-[#F4F4F6] p-3 text-sm"
                  />
                </FormControl>
                <FormMessage class="min-h-[20px]" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="message">
              <FormItem class="mt-4">
                <FormLabel>How can we help you?</FormLabel>
                <FormControl>
                  <Textarea
                    rows="4" placeholder="Any additional information..." v-bind="componentField"
                    class="border border-[#CACACA] rounded-xs bg-[#F4F4F6] p-3 text-sm resize-none"
                  />
                </FormControl>
                <FormMessage class="min-h-[20px]" />
              </FormItem>
            </FormField>
          </div>

          <Button
            type="submit"
            class="w-full md:w-auto bg-[#012D43] text-white text-sm px-8 py-3 rounded-xs hover:bg-[#023955] transition-all mt-6"
          >
            Send Message
          </Button>
        </form>
      </div>
    </div>
  </section>
</template>
