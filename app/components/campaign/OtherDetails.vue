<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { useFilter } from 'reka-ui'

import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Button } from '~/components/ui/button'

interface Props {
  values: any
  isPreview: boolean
  loading: boolean
}
const props = defineProps<Props>()

const emits = defineEmits(['setFiledValue', 'cancelEdit', 'submit'])
const { formState, enableEditSection } = useCreateCampaign()

const enableEdit = computed(() => enableEditSection.value === 'other-details' || !props.isPreview)

function cancelEdit() {
  enableEditSection.value = ''
  emits('cancelEdit')
}

const hooperModes = [
  {
    id: 1,
    name: 'Linear',
  },
  {
    id: 2,
    name: 'Random',
  },
]

const open = ref(false)

// disposition list
const { data: dispositionList } = await useLazyAsyncData('get-disposition-list', () =>
  useApi().post('/disposition', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// outbound line list
const { data: outboundLineList } = await useLazyAsyncData('get-outbound-line-list', () =>
  useApi().get('/voip-configurations', {

  }), {
  transform: (res) => {
    return res.data
  },
})
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })

const filteredDispositionList = computed(() => {
  const options = dispositionList?.value.filter((item: { id: number }) => !formState.value?.disposition_id?.includes(item?.id))
  return searchTerm.value ? options.filter((option: { title: string }) => contains(option.title, searchTerm.value)) : options
})
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class="border-b px-5 pt-5 pb-3 flex items-center justify-between">
      <div class="text-[16px] font-medium text-primary/100">
        Other Details
      </div>
      <div v-if="isPreview " class="flex items-center gap-x-2">
        <div v-if="enableEditSection === 'other-details'" class="flex gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="cancelEdit">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button type="submit" :disabled="loading" class="w-[105px] rounded" size="sm" @click="emits('submit')">
            <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save-rounded'" />
            Save
          </Button>
        </div>
        <div v-else class="flex items-center gap-x-2">
          <Button :disabled="enableEditSection.length" variant="outline" size="sm" class="rounded" @click="enableEditSection = 'other-details'">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
      </div>
    </div>
    <div class="p-5">
      <div class=" gap-x-5 w-full flex items-start">
        <div class="w-1/2">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.hopper_mode" name="hopper_mode">
            <FormItem v-auto-animate>
              <FormLabel class="font-normal text-sm">
                Hopper Mode Type
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
                  <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                    <SelectValue class="text-sm placeholder:text-[#ef698180]" placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in hooperModes" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ hooperModes.find((i) => i.id === formState.hopper_mode)?.name }}
                </div>
              </FormControl>
              <div v-if="errorMessage" class="text-red-600 text-sm">
                {{ errorMessage === 'Required' ? 'Hopper Mode is required' : errorMessage }}
              </div>
            </FormItem>
          </FormField>
        </div>
        <div class="w-1/2">
          <FormField v-slot="{ componentField, errorMessage }" v-model="formState.voip_configurations" name="voip_configurations">
            <FormItem v-auto-animate>
              <FormLabel class="font-normal text-sm">
                OutBound Line
              </FormLabel>
              <FormControl>
                <Select v-if="enableEdit" v-bind="componentField">
                  <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11 truncate">
                    <SelectValue class="text-sm data-[placeholder]:text-muted-foreground truncate" placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem v-for="item in outboundLineList" :key="item.id" :value="item.id">
                        {{ item.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div v-else class="text-[16px] font-normal text-primary">
                  {{ outboundLineList?.find((i: any) => i.id === formState?.voip_configurations)?.name }}
                </div>
              </FormControl>
              <FormMessage class="text-sm" />
            </FormItem>
          </FormField>
        </div>
      </div>

      <div class="mt-5">
        <Label class="text-sm font-normal">Disposition</Label>
        <FormField v-model="formState.disposition_id" name="disposition_id">
          <FormItem v-auto-animate>
            <FormControl>
              <Combobox v-if="enableEdit" v-model="formState.disposition_id" v-model:open="open" :ignore-filter="true">
                <ComboboxAnchor as-child>
                  <TagsInput v-model="formState.disposition_id" class="px-2 gap-2 [&_svg]:hidden w-full [&_[data-slot='command-input-wrapper']]:border-none [&_[data-slot='command-input-wrapper']]:px-1" @click="open = true">
                    <div class="flex gap-2 flex-wrap items-center ">
                      <TagsInputItem v-for="item in formState.disposition_id" :key="item" class="rounded-[6px] border border-[#00A086] bg-[#00A0861A] py-3 px-[7px] flex item-center justify-between gap-x-2" :value="item">
                        <div>
                          {{ dispositionList?.find((val: { id: any }) => val.id === item).title }}
                        </div>
                        <TagsInputItemDelete class="mr-0">
                          <Icon name="lucide:x" />
                        </TagsInputItemDelete>
                      </TagsInputItem>
                    </div>
                    <ComboboxInput v-model="searchTerm" as-child class="border-none ">
                      <TagsInputInput placeholder="disposition..." class=" w-full p-0 border-none focus-visible:ring-0 h-auto " @keydown.enter.prevent />
                    </ComboboxInput>
                  </TagsInput>

                  <ComboboxList class="w-[--reka-popper-anchor-width]">
                    <ComboboxEmpty />
                    <ComboboxGroup class="w-[400px]">
                      <ComboboxItem
                        v-for="item in filteredDispositionList" :key="item.id" :value="item.id"
                        @select.prevent="(ev) => {
                          searchTerm = ''

                          emits('setFiledValue', 'disposition_id', [...(values.disposition_id ?? []), ev.detail.value as number])

                          if (filteredDispositionList.length === 0) {
                            open = false
                          }
                        }"
                      >
                        {{ item.title }}
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </ComboboxAnchor>
              </Combobox>
              <div v-else class="text-[16px] font-normal text-primary flex gap-2 mt-1 ">
                <div v-for="item in formState.disposition_id" :key="item" class="rounded-[6px] items-center border border-[#00A086] bg-[#00A0861A] h-[22px] px-[7px] flex item-center justify-between " :value="item">
                  <div class="text-xs">
                    {{ dispositionList?.find((val: { id: any }) => val.id === item).title }}
                  </div>
                </div>
              </div>
            </FormControl>

            <FormMessage class="text-sm" />
          </FormItem>
        </FormField>
      </div>
    </div>
  </div>
</template>
