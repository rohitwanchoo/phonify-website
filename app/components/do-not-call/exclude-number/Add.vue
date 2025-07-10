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

const open = defineModel<boolean>('open', { default: false })

// campaign list options
const { data: campaignList, refresh: campaignRefresh } = await useLazyAsyncData('campaign-list', () =>
  useApi().post('/campaign'), {
  transform: res => res.data,
  immediate: false,
})

// County list
const { data: countrylist, refresh: countryRefresh } = await useLazyAsyncData('phone-country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  immediate: false,
})

const selectedCountryCode = ref('1') // Holds the selected code

function getCountryLabel(code: string) {
  const country = countrylist.value?.find((c: { phone_code: number | string }) => String(c.phone_code) === code)
  return country ? `${country.country_code} (+${country.phone_code})` : ''
}

function onDialogOpen(val: boolean) {
  if (val) {
    campaignRefresh()
    countryRefresh()
  }
}

const formSchema = toTypedSchema(z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  company_name: z.string().min(1, 'Company name is required'),
  country_code: z.string().min(1, 'Country code is required'),
  number: z.string().regex(/^\d+$/, 'must be a number').min(1, 'required').max(10, 'maximum 10 character allowed'),
  campaing_id: z.number().min(1, 'Campaign is requires'),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const loading = ref(false)

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    first_name: values.first_name,
    last_name: values.last_name,
    number: values.number,
    company_name: values.company_name,
    campaign_id: values.campaing_id,
  }

  try {
    loading.value = true
    const response = await useApi().post('/add-exclude-number', {
      ...payload,
    })
    showToast({
      message: response.message,
      type: response.success ? 'success' : 'error',
    })
    resetForm()
    open.value = false
    loading.value = false
    refreshNuxtData('exclude-number-list')
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
        Add Exclude Number
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Recycle Rule</DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <div class="flex gap-4 w-full">
            <!-- First name -->
            <FormField
              v-slot="{ componentField }"
              name="first_name"
            >
              <FormItem class="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter First Name"
                    class="px-3 py-2 !h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <!-- Last name -->
            <FormField
              v-slot="{ componentField }"
              name="last_name"
            >
              <FormItem class="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    placeholder="Enter Last Name"
                    class="px-3 py-2 !h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <!-- Company legal name -->
          <FormField
            v-slot="{ componentField }"
            name="company_name"
          >
            <FormItem>
              <FormLabel>Company Legal Name</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  placeholder="Enter Company Name"
                  class="px-3 py-2 !h-11 bg-white rounded-lg outline outline-offset-[-1px] outline-zinc-200 text-xs font-normal placeholder:text-xs placeholder:text-slate-800/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <!-- Number -->
          <FormField v-slot="{ componentField, errorMessage }" name="number">
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
            name="campaign_id"
          >
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select Campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in campaignList" :key="option.id" :value="option.id">
                      {{ option.title }}
                    </SelectItem>
                  </SelectContent>
                </Select>
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
