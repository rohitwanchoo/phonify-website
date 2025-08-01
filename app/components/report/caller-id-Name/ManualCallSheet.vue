<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'

const open = ref(false)

const formSchema = toTypedSchema(z.object({
  number: z.string().min(1, 'Phone number is required'),
}))

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    number: '',
  },
})

// Function to strip formatting from phone number
function stripPhoneFormatting(phoneNumber: string): string {
  return phoneNumber.replace(/\D/g, '')
}

const onSubmit = handleSubmit(async (values) => {
  try {
    // Strip formatting before sending to API
    const cleanNumber = stripPhoneFormatting(values.number)

    const response = await useApi().post('/run-manually-call-for-cname', {
      number: cleanNumber,
    })

    if (response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })
      open.value = false
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: `Error: ${error.message}`,
      type: 'error',
    })
  }
})

function closeSheet() {
  open.value = false
}
</script>

<template>
  <Button variant="outline" class="h-11 !text-white bg-black hover:bg-black" @click="open = true">
    <Icon name="material-symbols-light:contact-phone" class="!text-white text-xl" />
    Manually Call for CNAM
  </Button>

  <Sheet v-model:open="open">
    <SheetContent class="w-full md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          Manually Call for CNAM
        </SheetTitle>
      </SheetHeader>

      <form class="flex-1 flex flex-col" @submit="onSubmit">
        <!-- Scrollable content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-6 space-y-6">
            <div class="space-y-4">
              <!-- Phone Number Field -->
              <div>
                <FormField v-slot="{ componentField }" name="number">
                  <FormItem class="flex flex-col gap-1">
                    <FormLabel class="text-sm font-medium text-gray-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        v-maska="'(###) ###-####'"
                        placeholder="Enter Phone Number"
                        v-bind="componentField"
                        class="h-11 border-gray-200"
                        type="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky footer with buttons -->
        <div class="p-6 bg-white border-t space-y-2 flex gap-2">
          <Button
            type="button"
            variant="outline"
            class="w-[49%] h-12 text-md text-primary border-primary"
            @click="closeSheet"
          >
            <Icon name="material-symbols:close" size="20" />
            Close
          </Button>
          <Button
            class="w-[49%] h-12 text-md"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          >
            <Icon name="material-symbols:bolt" size="20" />
            Run
          </Button>
        </div>
      </form>
    </SheetContent>
  </Sheet>
</template>
