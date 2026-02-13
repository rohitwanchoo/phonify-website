<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { useFocus } from '@vueuse/core'

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

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Button } from '~/components/ui/button'

import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'

const props = defineProps<{
  values: any
  isPreview: boolean
  loading: boolean
}>()

const emits = defineEmits(['resetFields', 'submit'])

const target = shallowRef()
useFocus(target, { initialValue: true })

const { countryCodeList, enableEditSection, fetchCountryCodes } = useCreateCampaign()

// Fetch country codes when component mounts
onMounted(() => {
  fetchCountryCodes()
})

const enableEdit = computed(() => enableEditSection.value === 'campaign-details' || !props.isPreview)
watch(() => props.isPreview, (newVal) => {
  if (!newVal) {
    enableEditSection.value = ''
  }
})

const formState = useState<Campaign>('create-campaign-state')

function cancelEdit() {
  enableEditSection.value = ''
  emits('resetFields')
}

function saveCampaign() {
  emits('submit')
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class="border-b px-5 pt-[25.5px] pb-[17.5px] flex items-center justify-between">
      <div class="text-[16px] font-medium text-primary/100 flex items-center gap-2">
        <div class="p-1.5 bg-primary/10 rounded-lg">
          <Icon name="lucide:megaphone" class="h-4 w-4 text-primary" />
        </div>
        Campaign Details
      </div>
      <div v-if="!isPreview " v-auto-animate class="flex items-center gap-x-2">
        <div class="text-primary text-sm font-normal">
          status:
        </div>
        <div class="bg-[#FEF2F2] rounded-lg">
          <ToggleGroup v-model:model-value="formState.status" type="single">
            <ToggleGroupItem :value="1" class="!bg-[#FEF2F2] data-[state=on]:!bg-green-600 data-[state=on]:text-white font-normal gap-x-0 data-[state=on]:rounded-lg text-sm" aria-label="Status active">
              <Icon name="stash:circle-dot" size="30" />
              Active
            </ToggleGroupItem>
            <ToggleGroupItem :value="0" class="!bg-[#FEF2F2] data-[state=on]:!bg-red-600 data-[state=on]:rounded-lg font-normal data-[state=on]:text-white text-sm" aria-label="Status inactive">
              Inactive
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div v-else>
        <div v-if="enableEditSection === 'campaign-details'" class="flex gap-x-2">
          <Button :disabled="loading" variant="outline" size="sm" class="rounded" @click="cancelEdit">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button :disabled="loading" class="w-[105px] rounded" type="submit" size="sm" @click="saveCampaign">
            <Icon :name=" loading ? 'eos-icons:loading' : 'material-symbols:save-rounded'" />
            Save
          </Button>
        </div>
        <div v-else class="flex items-center gap-x-2">
          <Button :disabled="enableEditSection.length" variant="outline" size="sm" class="rounded" @click="enableEditSection = 'campaign-details'">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
      </div>
    </div>
    <div class="p-5 space-y-5 w-full">
      <div class="flex gap-[16px] w-full">
        <div class="w-1/2">
          <FormField v-slot="{ componentField }" v-model="formState.title" class="" name="title">
            <FormItem v-auto-animate>
              <FormLabel class="font-normal text-sm">
                Name
              </FormLabel>
              <FormControl>
                <Input v-if="enableEdit" ref="target" type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Enter Campaign Name" v-bind="componentField" />
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ values.title }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
        <div class="w-1/2">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.country_code" name="country_code">
            <FormItem v-auto-animate>
              <FormLabel class="font-normal text-sm">
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
        <FormField v-slot="{ componentField }" v-model="formState.description" class="" name="description">
          <FormItem v-auto-animate>
            <FormLabel class="font-normal text-sm">
              Description
            </FormLabel>
            <FormControl>
              <Textarea v-if="enableEdit" type="text" class="text-sm font-normal placeholder:text-sm h-11 " placeholder="Enter Campaign Description" v-bind="componentField" />
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
</template>
