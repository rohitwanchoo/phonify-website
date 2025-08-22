<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const route = useRoute()

const leadID = route.params.id

const listId = route.query.list_id

const { data: leadDetail } = useNuxtData('lead-details')

const fieldsData = computed(() => Object.values(leadDetail.value ?? {}))

const schema = toTypedSchema(
  z.object({
    fields: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        column_name: z.string(),
        value: z.string().min(1, 'This field is required'),

      }),
    ),
  }),
)

const form = useForm({
  validationSchema: schema,
  initialValues: {
    fields: Object.values(fieldsData.value),
  },
})

const { handleSubmit, setFieldValue, values } = form

const onSubmit = handleSubmit(async (values) => {
  try {
    const label_id = values.fields.map(item => item.id)
    const label_value = values.fields.map(item => item.value)

    const payload = {
      lead_id: leadID,
      label_id,
      label_value,
    }

    const response = await useApi().post('/update-lead-data', payload)
    showToast({ message: response.message })
    navigateTo(`/app/lead-management/lead/${route.params.id}?list_id=${route.query.list_id}`)
  }
  catch (error: any) {
    showToast({ message: error.message, type: 'error' })
  }
})

function onCancel() {
  navigateTo(`/app/lead-management/lead/${route.params.id}?list_id=${route.query.list_id}`)
}

const breadcrumbs = [
  {
    label: 'Lead',
    href: '/app/lead-management/lead',
    active: false,
  },
  {
    label: 'Lead Activity',
    href: `/app/lead-management/lead/${route.params.id}?list_id=${route.query.list_id}`,
    active: false,
  },
  {
    label: 'Edit Lead',
    active: true,
  },
]

const leadDetailsLoading = ref(false)

async function getLeadDetails() {
  try {
    leadDetailsLoading.value = true
    const response = await useApi().post('/get-data-for-edit-lead-page', {
      lead_id: leadID,
      parent_id: listId,
    })
    leadDetail.value = response.data.leadData
  }
  catch (error: any) {
    showToast({ message: error.message, type: 'error' })
  }
  finally {
    leadDetailsLoading.value = false
  }
}

onMounted(async () => {
  if (!leadDetail.value) {
    await getLeadDetails()
    setFieldValue('fields', Object.values(leadDetail.value))
  }
})
</script>

<template>
  <div class="space-y-6">
    <BaseHeader title="John Doe" :breadcrumbs="breadcrumbs" />
    <div class="h-[calc(100vh-200px)] overflow-auto border rounded-lg p-5">
      <form id="form" class="flex flex-col gap-4 h-full justify-between">
        <!-- Personal Information Section -->
        <!-- <div class="border border-gray-100 rounded-xl">
          <h2 class="text-base font-medium text-[#121E3D] px-5 pt-5 pb-3 border-b border-gray-100">
            Personal Information
          </h2>
          <div class="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
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
        </div> -->

        <div class="grid grid-cols-2 gap-4 items-start">
          <template v-if="leadDetailsLoading">
            <BaseSkelton v-for="i in 9" :key="i" class="h-11 w-full mb-2" rounded="rounded-sm" />
          </template>

          <template v-else>
            <FormField
              v-for="(field, index) in values.fields"
              v-slot="{ componentField }"
              :key="field.id"
              :name="`fields.${index}.value`"
            >
              <FormItem v-auto-animate>
                <FormLabel>{{ field.title }}</FormLabel>
                <FormControl>
                  <Input v-bind="componentField" class="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </template>
        </div>

        <!-- Action Buttons -->
        <div class="sticky bottom-0 bg-white shadow w-full flex flex-wrap justify-between items-center gap-4 mt-2.5 ">
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
            @click="onSubmit"
          >
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
