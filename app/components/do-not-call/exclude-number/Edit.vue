<script setup lang="ts">
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

const props = defineProps<{
  initialData: Record<string, any> | null
}>()

const open = defineModel<boolean>('open', { default: false })

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
    countryRefresh()
  }
}

// Form Setup
const { handleSubmit, isSubmitting, resetForm, setFieldValue } = useForm({
  initialValues: {
    number: props.initialData?.number,
    first_name: props.initialData?.first_name,
    last_name: props.initialData?.last_name,
    company_name: props.initialData?.company_name,
  },
})

// Submit Handler
const onSubmit = handleSubmit(async (values) => {
  const payload = {
    campaign_id: props.initialData?.campaign_id,
    number: values.number,
    first_name: values.first_name,
    last_name: values.last_name,
    company_name: values.company_name,
  }

  try {
    const response = await useApi().post('/edit-exclude-number', {
      ...payload,
    })

    if (response.success === 'true') {
      showToast({
        message: response.message,
        type: 'success',
      })
      resetForm()
      open.value = false
      refreshNuxtData('dnc-list')
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
      message: `${error?.message}`,
      type: 'error',
    })
  }
})

watch(open, async (newVal) => {
  if (newVal) {
    // Set initial values
    if (props.initialData) {
      setFieldValue('number', props.initialData.number)
      setFieldValue('first_name', props.initialData.first_name)
      setFieldValue('last_name', props.initialData.last_name)
      setFieldValue('company_name', props.initialData.company_name)
      resetForm({
        values: {
          number: props.initialData.number,
          first_name: props.initialData.first_name,
          last_name: props.initialData.last_name,
          company_name: props.initialData.company_name,
        },
      })
    }
  }
})
</script>

<template>
  <Dialog v-model:open="open" @update:open="onDialogOpen">
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Exclude Number</DialogTitle>
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
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
