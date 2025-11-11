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
import dotArrow from '~/assets/svg/public/dotArrow.svg'

useHead({
  title: 'Phonify-Contact Us',
})
definePageMeta({
  layout: 'website',
})

const schema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    message: z.string().min(1, 'Message is required'),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  },
})

const onSubmit = handleSubmit((_values) => {
  showToast({
    message: 'Form Submitted!',
    type: 'success',
  })
  resetForm()
})
</script>

<template>
  <section class="w-full bg-stone-50 overflow-hidden">
    <div class="max-w-[1440px] mx-auto lg:px-6 flex flex-col lg:flex-row lg:justify-between w-full h-auto">
      <!-- LEFT IMAGE SECTION -->
      <div class="hidden lg:flex justify-between items-center">
        <img
          src="/images/phonify-web/contact-us/small-transaction.png" alt="Dashboard preview"
          class="w-[680px] h-auto rounded-lg object-contain"
        >
      </div>
      <div
        class="w-full max-w-[680px] flex flex-col justify-center bg-[#F9F9F9] py-10 px-4 sm:px-8 lg:py-[100px] "
      >
        <div class="flex flex-col gap-3 mb-6 lg:mb-10 text-left">
          <h2 class="text-stone-900 text-2xl lg:text-5xl font-medium">
            Get in touch with us
          </h2>
          <p class="text-stone-700 text-base lg:text-xl font-extralight leading-relaxed">
            Boost agent productivity and efficiency with our advanced dialer that automates
            and streamlines outbound calls.
          </p>
        </div>

        <form class="flex flex-col gap-6 lg:gap-8" @submit="onSubmit">
          <div class="flex flex-col gap-5 lg:gap-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7">
              <FormField v-slot="{ componentField }" name="firstName">
                <FormItem class="flex flex-col">
                  <FormLabel class="text-stone-900 text-sm font-normal">First Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text" placeholder="Enter your first name" v-bind="componentField"
                      class="border border-stone-300 rounded-xs bg-zinc-100 p-3 text-sm h-12 placeholder:text-stone-400"
                    />
                  </FormControl>
                  <FormMessage class="text-[11px]" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem class="flex flex-col">
                  <FormLabel class="text-stone-900 text-sm font-normal">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text" placeholder="Enter your last name" v-bind="componentField"
                      class="border border-stone-300 rounded-xs bg-zinc-100 p-3 text-sm h-12 placeholder:text-stone-400"
                    />
                  </FormControl>
                  <FormMessage class="text-[11px]" />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-stone-900 text-sm font-normal">Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email" placeholder="Enter your email address" v-bind="componentField"
                    class="border border-stone-300 rounded-xs bg-zinc-100 p-3 text-sm h-12 placeholder:text-stone-400"
                  />
                </FormControl>
                <FormMessage class="text-[11px]" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="message">
              <FormItem>
                <FormLabel class="text-stone-900 text-sm font-normal">How can we help you?</FormLabel>
                <FormControl>
                  <Textarea
                    rows="4" placeholder="Any additional information..." v-bind="componentField"
                    class="border border-stone-300 rounded-xs bg-zinc-100 p-3 text-sm min-h-24 lg:min-h-44 resize-none placeholder:text-stone-400"
                  />
                </FormControl>
                <FormMessage class="text-[11px]" />
              </FormItem>
            </FormField>
          </div>

          <Button
            type="submit"
            class="w-full lg:w-auto h-12 lg:h-14 bg-[#1F1E1C] text-white font-medium px-8 py-3 rounded-xs"
          >
            Send Message
            <img :src="dotArrow" alt="Send Message" class="text-base">
          </Button>
        </form>
      </div>
    </div>
  </section>
</template>
