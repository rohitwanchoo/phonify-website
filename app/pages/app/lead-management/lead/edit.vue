<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const router = useRouter()

// Country code refs for phone numbers
const phoneCountryCode = ref('+1')
const workPhoneCountryCode = ref('+1')

// Define comprehensive form schema with requirements
const formSchema = toTypedSchema(z.object({
  // Personal Information - Required fields
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().min(1, 'Phone number is required').regex(/^\d{10,15}$/, 'Please enter a valid phone number (10-15 digits)'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),

  // Personal Information - Optional but with validation when provided
  workPhone: z.string().optional().refine(val => !val || /^\d{10,15}$/.test(val), {
    message: 'Please enter a valid work phone number (10-15 digits)',
  }),
  education: z.string().min(1, 'Education level is required'),
  extension: z.string().optional().refine(val => !val || /^\d{1,6}$/.test(val), {
    message: 'Extension must be numeric and up to 6 digits',
  }),

  // Company Information - Required fields
  legalCompanyName: z.string().min(1, 'Legal company name is required').min(2, 'Company name must be at least 2 characters'),
  businessType: z.string().min(1, 'Business type is required'),
  businessAge: z.string().min(1, 'Business age is required').regex(/^\d+$/, 'Business age must be a number'),
  currentPhoneSystem: z.string().min(1, 'Current phone system information is required'),
  leadSource: z.string().min(1, 'Lead source is required'),

  // Company Information - Financial requirements
  fundingAmount: z.string().min(1, 'Funding amount is required').regex(/^\d+(\.\d{2})?$/, 'Please enter a valid amount (e.g., 10000 or 10000.50)'),
  factorRate: z.string().min(1, 'Factor rate is required').regex(/^\d+(\.\d{1,3})?$/, 'Please enter a valid factor rate'),
  noOfOpenLoans: z.string().min(1, 'Number of open loans is required').regex(/^\d+$/, 'Must be a whole number'),

  // Address Details - All required for business verification
  address1: z.string().min(1, 'Address line 1 is required').min(5, 'Please enter a complete address'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required').min(2, 'Please enter a valid city name'),
  state: z.string().min(1, 'State is required').min(2, 'Please enter a valid state'),
  zip: z.string().min(1, 'ZIP code is required').regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'),

  // Financial Information - All required for lead qualification
  monthlyRevenue: z.string().min(1, 'Monthly revenue is required').regex(/^\d+(\.\d{2})?$/, 'Please enter a valid revenue amount'),
  annualRevenue: z.string().min(1, 'Annual revenue is required').regex(/^\d+(\.\d{2})?$/, 'Please enter a valid revenue amount'),
  creditScore: z.string().min(1, 'Credit score is required').regex(/^[3-8]\d{2}$/, 'Credit score must be between 300-850'),

  // Other Information - Optional but useful
  newLabel1: z.string().optional(),
  newLabel2: z.string().optional(),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  console.log('Form submitted with values:', values)
  // Handle form submission here
  router.push('/app/lead-management/lead/activity')
})

function onCancel() {
  resetForm()
  // Handle cancel action (maybe navigate back)
  console.log('Form cancelled')
}

const breadcrumbs = [
  {
    label: 'Lead',
    href: '/app/lead-management/lead',
    active: false,
  },
  {
    label: 'Lead Activity',
    href: '/app/lead-management/lead/activity',
    active: false,
  },
  {
    label: 'Edit Lead',
    href: '/app/lead-management/lead/edit',
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
            <FormField v-slot="{ componentField }" name="firstName">
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
            <FormField v-slot="{ componentField }" name="lastName">
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
            <FormField v-slot="{ componentField }" name="phoneNumber">
              <FormItem class="flex flex-col gap-1">
                <FormLabel class="text-sm font-medium text-gray-700">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div class="flex">
                    <Select v-model="phoneCountryCode">
                      <SelectTrigger class="w-24 data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                        <SelectValue placeholder="USA (+1)" class="text-xs md:text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">
                          USA (+1)
                        </SelectItem>
                        <SelectItem value="+44">
                          UK (+44)
                        </SelectItem>
                        <SelectItem value="+91">
                          IN (+91)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
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
                      <SelectTrigger class="w-24 data-[size=default]:h-full border-gray-200 rounded-r-none border-r-0 bg-gray-100">
                        <SelectValue placeholder="USA (+1)" class="text-xs md:text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+1">
                          USA (+1)
                        </SelectItem>
                        <SelectItem value="+44">
                          UK (+44)
                        </SelectItem>
                        <SelectItem value="+91">
                          IN (+91)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
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
            <FormField v-slot="{ componentField }" name="legalCompanyName">
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
            <FormField v-slot="{ componentField }" name="businessType">
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
            <FormField v-slot="{ componentField }" name="businessAge">
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
            <FormField v-slot="{ componentField }" name="address1">
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
          >
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
