<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import z from 'zod'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { TelInput } from '@/components/ui/tel-input'
import { Textarea } from '@/components/ui/textarea'
import dotArrow from '~/assets/svg/public/dotArrow.svg'

useHead({
  title: 'Phonify-Contact Us',
})
definePageMeta({
  layout: 'website',
})

const isPhoneValid = ref<boolean>(false)

const formSchema = toTypedSchema(z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(1, 'Message is required'),
  phoneNumber: z.string().min(1, 'Phone number is required').refine(
    (val: string | null | undefined) => {
      // If phone number has value, validate format
      if (val && val.trim().length > 0)
        return isPhoneValid.value

      return true
    },
    { message: 'Please enter a valid phone number' },
  ),
}),
)

const { handleSubmit, resetForm, isSubmitting, setFieldError } = useForm({
  validationSchema: formSchema,
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    phoneNumber: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  try {
    // Create FormData object
    const formData = new FormData()
    formData.append('access_key', '09ffb4a7-8e0b-44fe-b499-7b91384c666d')
    formData.append('name', `${values.firstName} ${values.lastName}`)
    formData.append('email', values.email)
    formData.append('message', values.message)
    formData.append('phoneNumber', values.phoneNumber)

    // Submit to Web3Forms API
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()

    if (data.success) {
      showToast({
        message: 'Message sent successfully! We will get back to you soon.',
        type: 'success',
      })
      resetForm({
        values: {
          firstName: '',
          lastName: '',
          email: '',
          message: '',
          phoneNumber: '',
        },
      })
      setTimeout(() => {
        setFieldError('phoneNumber', '')
      }, 50)
    }
    else {
      showToast({
        message: 'Failed to send message. Please try again.',
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: error.message,
      type: 'error',
    })
  }
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
                  <FormLabel class="text-stone-900 text-sm font-normal">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text" placeholder="Enter your first name" v-bind="componentField"
                      class="border border-stone-300 rounded-xs bg-zinc-100 p-3 text-sm h-12 placeholder:text-stone-400"
                      :disabled="isSubmitting"
                    />
                  </FormControl>
                  <FormMessage class="text-[11px]" />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="lastName">
                <FormItem class="flex flex-col">
                  <FormLabel class="text-stone-900 text-sm font-normal">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text" placeholder="Enter your last name" v-bind="componentField"
                      class="border border-stone-300 rounded-xs bg-zinc-100 p-3 text-sm h-12 placeholder:text-stone-400"
                      :disabled="isSubmitting"
                    />
                  </FormControl>
                  <FormMessage class="text-[11px]" />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel class="text-stone-900 text-sm font-normal">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email" placeholder="Enter your email address" v-bind="componentField"
                    class="border border-stone-300 rounded-xs bg-zinc-100 p-3 text-sm h-12 placeholder:text-stone-400"
                    :disabled="isSubmitting"
                  />
                </FormControl>
                <FormMessage class="text-[11px]" />
              </FormItem>
            </FormField>
            <!-- Phone Number -->
            <FormField v-slot="{ componentField, errorMessage }" name="phoneNumber">
              <FormItem>
                <FormLabel class="text-stone-900 text-sm font-normal">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <TelInput
                    :class="errorMessage ? '!border-red-500' : '!border-stone-300'"
                    class="!rounded-xs !h-12 !bg-zinc-100 !border  !placeholder:text-stone-400"
                    v-bind="componentField" @validate="(val) => {
                      isPhoneValid = val
                    }"
                  />
                </FormControl>
                <FormMessage class="text-[11px]" />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="message">
              <FormItem>
                <FormLabel class="text-stone-900 text-sm font-normal">
                  How can we help you?
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows="4" placeholder="Any additional information..." v-bind="componentField"
                    class="border border-stone-300 rounded-xs bg-zinc-100 p-3 text-sm min-h-24 lg:min-h-44 resize-none placeholder:text-stone-400"
                    :disabled="isSubmitting"
                  />
                </FormControl>
                <FormMessage class="text-[11px]" />
              </FormItem>
            </FormField>
          </div>

          <Button
            type="submit"
            class="w-full lg:w-auto h-12 lg:h-14 bg-[#1F1E1C] text-white font-medium px-8 py-3 rounded-xs disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          >
            Send Message
            <img v-if="!isSubmitting" :src="dotArrow" alt="Send Message" class="text-base">
          </Button>
        </form>
      </div>
    </div>
  </section>
</template>
