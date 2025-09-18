<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'

import { useForm } from 'vee-validate'

import * as z from 'zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from '@/components/ui/select'
import { Button } from '~/components/ui/button'

import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

const props = defineProps<{
  campaign?: Campaign
  loading: boolean
}>()

const emit = defineEmits(['update'])

const { data: countryCodeList } = useNuxtData('get-country-code-list')

interface Campaign {
  title: string
  country_code: number
  description: string
}

const formSchema = toTypedSchema(z.object({
  title: z.string().min(1, 'required').max(50),
  country_code: z.number().min(1, 'required'),
  description: z.string().min(1, 'required').max(255),

}))

const { handleSubmit, resetForm, values, setValues } = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: '',
    country_code: 0,
    description: '',
  },
})

watch(() => props.campaign, (campaign) => {
  if (campaign) {
    setValues({
      title: props?.campaign?.title,
      country_code: props?.campaign?.country_code,
      description: props?.campaign?.description,
    })
  }
})

const onSubmit = handleSubmit((values) => {
  emit('update', values)
})
const enableEdit = ref(false)

function cancelEdit() {
  enableEdit.value = false
  setValues({
    title: props?.campaign?.title,
    country_code: props?.campaign?.country_code,
    description: props?.campaign?.description,
  })
}
</script>

<template>
  <form>
    <div class="border rounded-lg bg-white">
      <div class="border-b px-5 pt-[25.5px] pb-[17.5px] flex items-center justify-between">
        <div class="text-[16px] font-medium text-primary/100">
          Campaign Details
        </div>
        <div v-if="!enableEdit" class="flex items-center gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="enableEdit = true">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
        <div v-else class="flex gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="cancelEdit">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button class="w-[105px] rounded" size="sm" @click="onSubmit">
            <Icon name="material-symbols:save-rounded" />
            Save
          </Button>
        </div>
      </div>
      <!-- Skelton loader -->

      <div v-if="loading" class="p-5 space-y-5 w-full">
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <BaseSkelton class="h-11 w-full mb-2" rounded="rounded-sm" />
          </div>
          <div class="w-1/2">
            <BaseSkelton class="h-11 w-full mb-2" rounded="rounded-sm" />
          </div>
        </div>
        <div>
          <BaseSkelton class="h-20 w-full mb-2" rounded="rounded-sm" />
        </div>
      </div>
      <div v-else class="p-5 space-y-5 w-full">
        <div class="flex gap-[16px] w-full">
          <div class="w-1/2">
            <FormField v-slot="{ componentField }" class="" name="title">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm" :class="!enableEdit && 'text-gray-500'">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    v-if="enableEdit"
                    type="text" class="text-sm font-normal placeholder:text-sm h-11"
                    placeholder="Enter Campaign Name" v-bind="componentField"
                  />
                  <div v-else class="text-[16px] font-normal text-primary">
                    {{ values.title }}
                  </div>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
          <div class="w-1/2">
            <FormField v-slot="{ componentField, errorMessage }" name="country_code">
              <FormItem v-auto-animate>
                <FormLabel class="font-normal text-sm" :class="!enableEdit && 'text-gray-500'">
                  Country Code
                </FormLabel>
                <FormControl>
                  <Select v-if="enableEdit" v-bind="componentField">
                    <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                      <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in countryCodeList" :key="item.id" :value="item.phonecode">
                          {{ item.name }} (+{{ item.phonecode }})
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <div v-else class="text-[16px] font-normal text-primary">
                    {{ countryCodeList?.find((item: { phonecode: number; name: string }) => item.phonecode === values.country_code)?.name }} (+{{ values.country_code }})
                  </div>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </div>
        </div>

        <div class="w-full">
          <FormField v-slot="{ componentField }" class="" name="description">
            <FormItem v-auto-animate>
              <FormLabel class="font-normal text-sm" :class="!enableEdit && 'text-gray-500'">
                Description
              </FormLabel>
              <FormControl>
                <Textarea v-if="enableEdit" type="text" class="text-sm font-normal placeholder:text-sm  " placeholder="Enter Campaign Name" v-bind="componentField" />
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ values.description }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
  </form>
</template>

<style>

</style>
