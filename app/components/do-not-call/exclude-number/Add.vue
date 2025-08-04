<script setup lang="ts">
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
const { data: campaignList, status: campaignListStatus, refresh: campaignRefresh } = await useLazyAsyncData('campaign-list', () =>
  useApi().post('/campaign'), {
  transform: res => res.data,
  immediate: false,
})

// County list
const { data: countrylist, status: countrylistStatus, refresh: countryRefresh } = await useLazyAsyncData('phone-country-list', () =>
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
  number: z.string().min(1, 'phone number is required'),
  campaign_id: z.number().min(1, 'Campaign is requires'),
}))

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    first_name: '',
    last_name: '',
    number: '',
    company_name: '',
    campaign_id: 0,
  },
  validateOnInput: true,
})

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    first_name: values.first_name,
    last_name: values.last_name,
    number: values.number,
    company_name: values.company_name,
    campaign_id: values.campaign_id,
  }

  try {
    const response = await useApi().post('/add-exclude-number', {
      ...payload,
    })
    showToast({
      message: response.message,
      type: response.success ? 'success' : 'error',
    })
    resetForm()
    open.value = false
    refreshNuxtData('exclude-number-list')
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
  <Dialog v-model:open="open" @update:open="onDialogOpen">
    <DialogTrigger as-child>
      <Button class="h-11">
        <Icon class="!text-white" size="20" name="material-symbols:add" />
        Add Exclude Number
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Exclude Number</DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <div class="flex gap-4 w-full items-start">
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
          <FormField v-slot="{ componentField, errorMessage }" name="number" :validate-on-input="true">
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
            name="campaign_id"
          >
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select Campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="campaignListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in campaignList" :key="option.id" :value="option.id">
                        {{ option.title }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button class="flex-1 h-11 text-primary" variant="outline" @click="open = false">
            <Icon name="material-symbols:close" size="20" />
            Close
          </Button>
          <Button type="submit" class="flex-1 h-11" :loading="isSubmitting" :disabled="isSubmitting">
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
