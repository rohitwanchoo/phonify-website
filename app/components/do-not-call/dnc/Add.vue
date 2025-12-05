<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Textarea from '~/components/ui/textarea/Textarea.vue'

const props = defineProps<{
  initialData?: any
  isEdit?: boolean
}>()

const emits = defineEmits(['complete'])

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

// extension list options
const { data: extensionList, status: extensionListStatus, refresh: extensionRefresh } = await useLazyAsyncData('extension-group-map', () =>
  useApi().get('/extension-group-map'), {
  transform: res => res.data,
  immediate: false,
})

// County list
const { data: countrylist, status: countrylistStatus, refresh: countryRefresh } = await useLazyAsyncData('phone-country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  immediate: false,
})

function getCountryLabel(code: string) {
  const country = countrylist.value?.find((c: { phone_code: number | string }) => String(c.phone_code) === code)
  return country ? `${country.country_code} (+${country.phone_code})` : ''
}

function splitPhone(fullNumber: string | number) {
  const str = String(fullNumber).trim()

  // last 10 digits → actual phone number
  const number = str.slice(-10)

  // remaining digits → country code
  const country_code = str.slice(0, str.length - 10) || '1'

  return { country_code, number }
}


const formSchema = toTypedSchema(z.object({
  country_code: z.string().min(1, 'Country code is required'),
  number: z.string().min(1, 'Phone number is required'),
  extension: z.number().int().min(1, 'Extension is required'),
  comment: z.string().min(1, 'Comment is required'),
}))

const { handleSubmit, isSubmitting, resetForm, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    country_code: '1',
    number: '',
    extension: 0,
    comment: '',
  },
})

watch(open, async (newVal) => {
  if (newVal && props.isEdit && props.initialData) {
    extensionRefresh()
    countryRefresh()
    const phoneParts = splitPhone(props.initialData.number)

    setValues({
      country_code: phoneParts.country_code,
      number: phoneParts.number,
      extension: props.initialData.extension,
      comment: props.initialData.comment,
    })
  }
  else {
    extensionRefresh()
    countryRefresh()
    resetForm({
      values: {
        country_code: '1',
        number: '',
        extension: 0,
        comment: '',
      },
      errors: {},
    })
  }
})

const onSubmit = handleSubmit(async (values) => {
  // Clean the phone number - remove formatting before sending to API
  const cleanNumber = props.isEdit ? props.initialData.number : values.number.replace(/\D/g, '')

  const api = props.isEdit ? '/edit-dnc' : '/add-dnc'

  const payload = {
    number: values.country_code + cleanNumber,
    extension: values.extension,
    comment: values.comment,
  }

  try {
    const response = await useApi().post(api, payload)
    if (response.success === 'true') {
      showToast({
        message: response.message,
        type: 'success',
      })
      open.value = false
      refreshNuxtData('dnc-list')
      emits('complete')
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
      message: `${error.message}`,
      type: 'error',
    })
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="!text-white" name="material-symbols:add" size="20" />
          Add DNC
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {{ props.isEdit ? 'Edit DNC' : 'Add DNC' }}
        </DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField v-slot="{ componentField, errorMessage }" class="" name="number" :validate-on-input="true">
            <FormItem>
              <FormLabel class="font-normal text-sm">
                Phone Number
              </FormLabel>
              <FormControl>
                <div class="flex">
                  <div :class="errorMessage && 'border-red-600'" class="border flex items-center rounded-lg overflow-hidden w-full">
                    <FormField v-slot="{ componentField: countryCodeComponentField, errorMessage: countryCodeErrorMessage }" name="country_code" class="relative">
                      <FormItem>
                        <FormControl>
                          <Select v-bind="countryCodeComponentField">
                            <SelectTrigger
                              class="w-fit rounded-r-none bg-gray-100 !h-11"
                              :class="countryCodeErrorMessage && errorMessage && 'border-red-600 border'"
                            >
                              <SelectValue>
                                <span class="text-sm text-nowrap">
                                  {{ getCountryLabel(countryCodeComponentField.modelValue || '1') }}
                                </span>
                              </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                <SelectItem v-if="countrylistStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                                  <Icon name="eos-icons:loading" />
                                </SelectItem>
                                <template v-else>
                                  <SelectItem
                                    v-for="item in countrylist"
                                    :key="item.id"
                                    :value="String(item.phone_code)"
                                  >
                                    {{ item.country_name }} (+{{ item.phone_code }})
                                  </SelectItem>
                                </template>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <Input
                      v-maska="'(###) ###-####'"
                      type="tel"
                      placeholder="Enter Phone Number"
                      class="text-sm focus-visible:ring-0 rounded-l-none focus:ring-0 border-0 font-normal placeholder:text-sm h-11"
                      v-bind="componentField"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage class="text-sm text-left" />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="extension"
          >
            <FormItem>
              <FormLabel>Extension</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select Extension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="extensionListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in extensionList" :key="option.extension" :value="option.extension">
                        {{ option.first_name }} {{ option.last_name }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage class="text-sm text-left" />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="comment"
          >
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea v-bind="componentField" type="text" placeholder="Comment here" class="px-3 py-[14px] min-h-[104px]" />
              </FormControl>
              <FormMessage class="text-sm text-left" />
            </FormItem>
          </FormField>

          <DialogFooter>
            <DialogClose class="sm:w-1/2">
              <Button variant="outline" class="h-11  w-full">
                <Icon name="material-symbols:close" size="20" />
                Close
              </Button>
            </DialogClose>
            <Button :disabled="isSubmitting" for="form" class="h-11 sm:w-1/2" type="submit" :loading="isSubmitting" @click="onSubmit">
              <Icon name="material-symbols:save" size="20" />
              {{ isEdit ? 'Update' : 'Save' }}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
