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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import Textarea from '~/components/ui/textarea/Textarea.vue'

const open = defineModel<boolean>('open', { default: false })

// extension list options
const { data: extensionList, refresh: extensionRefresh } = await useLazyAsyncData('extension-group-map', () =>
  useApi().get('/extension-group-map'), {
  transform: res => res.data,
  immediate: false,
})

// County list
const { data: countrylist, refresh: countryRefresh } = await useLazyAsyncData('phone-country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  immediate: false,
})

const selectedCountryCode = ref('') // Holds the selected code

function getCountryLabel(code: string) {
  const country = countrylist.value?.find((c: { phone_code: number | string }) => String(c.phone_code) === code)
  return country ? `${country.country_code} (+${country.phone_code})` : ''
}

function onDialogOpen(val: boolean) {
  if (val) {
    extensionRefresh()
    countryRefresh()
  }
}

const formSchema = toTypedSchema(z.object({
  country_code: z.string().min(1, 'Country code is required'),
  number: z.string().regex(/^\d+$/, 'must be a number').min(1, 'required').max(10, 'maximum 10 character allowed'),
  extension: z.number().int().min(1, 'Extension is required'),
  comment: z.string().min(1, 'Comment is required'),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    number: values.number,
    extension: values.extension,
    comment: values.comment,
  }

  try {
    loading.value = true
    const response = await useApi().post('/add-dnc', {
      ...payload,
    })
    showToast({
      message: response.message,
      type: response.success ? 'success' : 'error',
    })
    resetForm()
    open.value = false
    loading.value = false
    refreshNuxtData('dnc-list')
  }
  catch (error: any) {
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog v-model:open="open" @update:open="onDialogOpen">
    <DialogTrigger as-child>
      <Button>
        <Icon class="!text-white" name="lucide:plus" />
        Add DNC
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Recycle Rule</DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField v-slot="{ componentField, errorMessage }" class="" name="number">
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
                          <Select v-bind="countryCodeComponentField" v-model="selectedCountryCode">
                            <SelectTrigger
                              class="w-fit rounded-r-none bg-gray-100 !h-11"
                              :class="countryCodeErrorMessage && errorMessage && 'border-red-600 border'"
                            >
                              <SelectValue>
                                <span class="text-sm text-nowrap">
                                  {{ getCountryLabel(selectedCountryCode) }}
                                </span>
                              </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                              <SelectGroup>
                                <SelectItem
                                  v-for="item in countrylist"
                                  :key="item.id"
                                  :value="String(item.phone_code)"
                                >
                                  {{ item.country_name }} (+{{ item.phone_code }})
                                </SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    </FormField>
                    <Input
                      type="tel"
                      maxlength="10"
                      placeholder="Enter Phone Number"
                      class="text-sm focus-visible:ring-0 rounded-l-none focus:ring-0 border-0 font-normal placeholder:text-sm h-11"
                      v-bind="componentField"
                      @input="$event.target.value = $event.target.value.replace(/[^0-9]/g, '').slice(0, 10)"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage class="text-sm text-right" />
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
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select Extension" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in extensionList" :key="option.extension" :value="option.extension">
                      {{ option.first_name }} {{ option.last_name }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button class="w-[50%] text-primary" variant="outline" @click="open = false">
            <Icon name="lucide:x" class="w-4 h-4 mr-1" />
            Close
          </Button>
          <Button type="submit" class="w-[50%]" :loading="loading" :disabled="loading">
            <Icon name="material-symbols:save" class="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
