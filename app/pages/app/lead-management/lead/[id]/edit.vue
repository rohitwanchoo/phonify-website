<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const router = useRouter()
const route = useRoute()

const phoneCountryCode = ref(1)
const workPhoneCountryCode = ref(1)

const formSchema = toTypedSchema(z.object({
  first_name: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  phone_number: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10,15}$/, 'Phone number must be 10-15 digits'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  work_phone: z.string()
    .optional()
    .refine(val => !val || /^\d{10,15}$/.test(val), {
      message: 'Work phone must be 10-15 digits if provided',
    }),
  education: z.string().optional(),
  extension: z.string()
    .optional()
    .refine(val => !val || /^\d{1,6}$/.test(val), {
      message: 'Extension must be numeric and up to 6 digits',
    }),
  company_name: z.string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  business_type: z.string().optional(),
  business_age: z.string()
    .optional()
    .refine(val => !val || /^\d+$/.test(val), {
      message: 'Business age must be a valid number',
    }),
  currentPhoneSystem: z.string().optional(),
  leadSource: z.string().optional(),
  fundingAmount: z.string()
    .optional()
    .refine(val => !val || /^\d+(?:\.\d{2})?$/.test(val), {
      message: 'Funding amount must be a valid number with up to 2 decimal places',
    }),
  factorRate: z.string()
    .optional()
    .refine(val => !val || /^\d+(?:\.\d{1,3})?$/.test(val), {
      message: 'Factor rate must be a valid number with up to 3 decimal places',
    }),
  noOfOpenLoans: z.string()
    .optional()
    .refine(val => !val || /^\d+$/.test(val), {
      message: 'Number of open loans must be a valid number',
    }),
  address: z.string()
    .min(1, 'Address is required')
    .min(5, 'Address must be at least 5 characters'),
  address2: z.string().optional(),
  city: z.string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters'),
  state: z.string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters'),
  zip: z.string()
    .optional()
    .refine(val => !val || /^\d{5}(?:-\d{4})?$/.test(val), {
      message: 'ZIP code must be in format 12345 or 12345-6789',
    }),
  monthlyRevenue: z.string()
    .optional()
    .refine(val => !val || /^\d+(?:\.\d{2})?$/.test(val), {
      message: 'Monthly revenue must be a valid number with up to 2 decimal places',
    }),
  annualRevenue: z.string()
    .optional()
    .refine(val => !val || /^\d+(?:\.\d{2})?$/.test(val), {
      message: 'Annual revenue must be a valid number with up to 2 decimal places',
    }),
  creditScore: z.string()
    .optional()
    .refine(val => !val || /^[3-8]\d{2}$/.test(val), {
      message: 'Credit score must be a 3-digit number between 300-899',
    }),
  newLabel1: z.string().optional(),
  newLabel2: z.string().optional(),
}))

interface Lead {
  first_name: string
  last_name: string
  phone_number: string
  work_phone?: string
  email: string
  education: string
  extension?: string
  company_name: string
  business_type: string
  business_age: string
  current_phone_system: string
  lead_source: string
  funding_amount: string
  factor_rate: string
  no_of_open_loans: string
  address: string
  address2?: string
  city: string
  state: string
  zip: string
  monthly_revenue: string
  annual_revenue: string
  credit_score: string
  new_label_1?: string
  new_label_2?: string
  phone_country_code?: string
  work_phone_country_code?: string
}

// County list
const { data: countrylist } = await useLazyAsyncData('phone-country-list', () =>
  useApi().post('/phone-country-list'), {
  transform: res => res.data,
  immediate: true,
})

function getCountryLabel(code: string) {
  const country = countrylist.value?.find((c: { phone_code: number | string }) => String(c.phone_code) === code)
  return country ? `${country.country_code} (+${country.phone_code})` : ''
}

// Lead data
const { data: leadData, status: leadDataStatus } = await useLazyAsyncData<Lead>('lead-details', () =>
  useApi().get(`/lead/${route.params.id}`), {
  transform: (res: any) => res.data as Lead,
})

const { handleSubmit, resetForm, setFieldError, setValues, isSubmitting } = useForm({
  validationSchema: formSchema,
})

// Watch for fetched data and populate form
watch(leadData, (data) => {
  if (!data)
    return
  setValues({
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    phone_number: data.phone_number || '',
    email: data.email || '',
    work_phone: data.work_phone || '',
    education: data.education || '',
    extension: data.extension || '',
    company_name: data.company_name || '',
    business_type: data.business_type || '',
    business_age: data.business_age || '',
    currentPhoneSystem: data.current_phone_system || '',
    leadSource: data.lead_source || '',
    fundingAmount: data.funding_amount || '',
    factorRate: data.factor_rate || '',
    noOfOpenLoans: data.no_of_open_loans || '',
    address: data.address || '',
    address2: data.address2 || '',
    city: data.city || '',
    state: data.state || '',
    zip: data.zip || '',
    monthlyRevenue: data.monthly_revenue || '',
    annualRevenue: data.annual_revenue || '',
    creditScore: data.credit_score || '',
    newLabel1: data.new_label_1 || '',
    newLabel2: data.new_label_2 || '',
  })
  phoneCountryCode.value = Number(data.phone_country_code) || 1
  workPhoneCountryCode.value = Number(data.work_phone_country_code) || 1
})

// Submit handler to PUT data
// Submit handler using option fields for additional data
const onSubmit = handleSubmit(async (values) => {
  try {
    // Main fields that exist in database
    const supportedFields = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone_number: values.phone_number,
      city: values.city,
      state: values.state,
      address: values.address,
      company_name: values.company_name,

      // Map additional fields to option fields
      option_30: phoneCountryCode.value, // phone_country_code
      option_31: workPhoneCountryCode.value, // work_phone_country_code
      option_32: values.work_phone || '', // work_phone
      option_33: values.education || '', // education
      option_34: values.extension || '', // extension
      option_35: values.business_type || '', // business_type
      // Add more mappings as needed for other fields
    }

    const response = await useApi().post(`/lead/${route.params.id}/edit`, supportedFields)

    if (response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })
      router.push(`/app/lead-management/lead/${route.params.id}`)
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    handleFieldErrors(error?.data, setFieldError)
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
})

function onCancel() {
  resetForm()
  router.push(`/app/lead-management/lead/${route.params.id}`)
}

const breadcrumbs = [
  {
    label: 'Lead',
    href: '/app/lead-management/lead',
    active: false,
  },
  {
    label: 'Lead Activity',
    href: `/app/lead-management/lead/${route.params.id}`,
    active: false,
  },
  {
    label: 'Edit Lead',
    active: true,
  },
]
</script>

<template>
  <div class="space-y-6">
    <BaseHeader title="John Doe" :breadcrumbs="breadcrumbs" />
    <div class="h-[calc(100vh-200px)] overflow-auto">
      <form id="form" class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <!-- Personal Information Section -->
        <div class="border border-gray-100 rounded-xl">
          <h2 class="text-base font-medium text-[#121E3D] px-5 pt-5 pb-3 border-b border-gray-100">
            Personal Information
          </h2>
          <div class="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- First Name -->
            <FormField v-slot="{ componentField }" name="first_name">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-[#162D3A]">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type First Name"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Last Name -->
            <FormField v-slot="{ componentField }" name="last_name">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type Last Name"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Phone Number -->
            <FormField v-slot="{ componentField }" name="phone_number">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <Select v-model="phoneCountryCode">
                      <SelectTrigger class="w-fit data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                        <SelectValue>
                          <span class="text-sm text-nowrap">
                            {{ getCountryLabel(String(phoneCountryCode)) }}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="(item, index) in countrylist" :key="index" :value="item.phone_code">
                          {{ item.country_name }} (+{{ item.phone_code }})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      v-maska="'(###) ###-####'"
                      placeholder="Enter Phone Number"
                      v-bind="componentField"
                      class="h-11 border-gray-200 rounded-l-none text-xs md:text-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Work Phone -->
            <FormField v-slot="{ componentField }" name="workPhone">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Work Phone
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <Select v-model="workPhoneCountryCode">
                      <SelectTrigger class="w-fit data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                        <SelectValue>
                          <span class="text-sm text-nowrap">
                            {{ getCountryLabel(String(workPhoneCountryCode)) }}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="(item, index) in countrylist" :key="index" :value="item.phone_code">
                          {{ item.country_name }} (+{{ item.phone_code }})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      v-maska="'(###) ###-####'"
                      placeholder="Enter Phone Number"
                      v-bind="componentField"
                      class="h-11 border-gray-200 rounded-l-none text-xs md:text-sm"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Email -->
            <FormField v-slot="{ componentField }" name="email">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type E-mail"
                    type="email"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Education -->
            <FormField v-slot="{ componentField }" name="education">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Education
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Education"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Extension -->
            <FormField v-slot="{ componentField }" name="extension">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Extension
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Extension"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Company Information Section -->
        <div class="border border-gray-100 rounded-xl">
          <h2 class="text-base font-medium text-[#121E3D] px-5 pt-5 pb-3 border-b border-gray-100">
            Company Information
          </h2>
          <div class="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Legal Company Name -->
            <FormField v-slot="{ componentField }" name="company_name">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Legal Company Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Legal Company Name"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Business Type -->
            <FormField v-slot="{ componentField }" name="business_type">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Business Type
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Business Type"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Business Age -->
            <FormField v-slot="{ componentField }" name="business_age">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Business Age
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Business Age"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Current Phone System -->
            <FormField v-slot="{ componentField }" name="currentPhoneSystem">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Current Phone System
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Current Phone System"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Lead Source -->
            <FormField v-slot="{ componentField }" name="leadSource">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Lead Source
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Lead Source"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Funding Amount -->
            <FormField v-slot="{ componentField }" name="fundingAmount">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Funding Amount
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Funding Amount"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Factor Rate -->
            <FormField v-slot="{ componentField }" name="factorRate">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Factor Rate
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Factor Rate"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- No of Open Loans -->
            <FormField v-slot="{ componentField }" name="noOfOpenLoans">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  No of Open Loans
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="No of Open Loans"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Address Details Section -->
        <div class="border border-gray-100 rounded-xl">
          <h2 class="text-base font-medium text-[#121E3D] px-5 pt-5 pb-3 border-b border-gray-100">
            Address Details
          </h2>
          <div class="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Address1 -->
            <FormField v-slot="{ componentField }" name="address">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Address1
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Address2 -->
            <FormField v-slot="{ componentField }" name="address2">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Address2
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address 2"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- City -->
            <FormField v-slot="{ componentField }" name="city">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="City"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- State -->
            <FormField v-slot="{ componentField }" name="state">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  State
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="State"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Zip -->
            <FormField v-slot="{ componentField }" name="zip">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Zip
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Zip"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Financial Information Section -->
        <div class="border border-gray-100 rounded-xl">
          <h2 class="text-base font-medium text-[#121E3D] px-5 pt-5 pb-3 border-b border-gray-100">
            Financial Information
          </h2>
          <div class="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Monthly Revenue -->
            <FormField v-slot="{ componentField }" name="monthlyRevenue">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Monthly Revenue
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Monthly Revenue"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Annual Revenue -->
            <FormField v-slot="{ componentField }" name="annualRevenue">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Annual Revenue
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Annual Revenue"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Credit Score -->
            <FormField v-slot="{ componentField }" name="creditScore">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Credit Score
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Credit Score"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Other Information Section -->
        <div class="border border-gray-100 rounded-xl">
          <h2 class="text-base font-medium text-[#121E3D] px-5 pt-5 pb-3 border-b border-gray-100">
            Other Information
          </h2>
          <div class="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- New Label 1 -->
            <FormField v-slot="{ componentField }" name="newLabel1">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  New Label 1
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="New Label 1"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- New Label 2 -->
            <FormField v-slot="{ componentField }" name="newLabel2">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  New Label 2
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="New Label 2"
                    v-bind="componentField"
                    class="h-11 border-gray-200 text-xs md:text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="sticky bottom-0 bg-white shadow w-full flex flex-wrap justify-between items-center gap-4 mt-2.5 p-2 md:p-6 border-t border-gray-200">
          <Button
            variant="outline"
            class="flex-1 px-8 py-3 h-8 md:h-12 w-[100px] md:w-full"
            @click="onCancel"
          >
            <Icon name="material-symbols:close" size="20" />
            Cancel
          </Button>
          <Button
            type="submit"
            class="flex-1 px-8 py-3 h-8 md:h-12 w-[100px] md:w-full"
            :disabled="isSubmitting || leadDataStatus === 'pending'"
            :loading="isSubmitting"
          >
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
