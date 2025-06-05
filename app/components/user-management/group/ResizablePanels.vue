<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { Button } from '~/components/ui/button'

import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import Actions from './Actions.vue'

const groups = [
  {
    id: 'group-1',
    name: 'Extension Group dsaf fadsfa dfdasf adsfdsf dsfdfasd',
    count: 10,
  },
  {
    id: 'group-2',
    name: 'Extension Group #2',
    count: 10,
  },
  {
    id: 'group-3',
    name: 'Extension Group #3',
    count: 10,
  },
  {
    id: 'group-4',
    name: 'Extension Group #4',
    count: 10,
  },
  {
    id: 'group-5',
    name: 'Extension Group #5',
    count: 10,
  },
  {
    id: 'group-6',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-7',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-8',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-9',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-10',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-11',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-12',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-13',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-14',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-15',
    name: 'Extension Group #6',
    count: 10,
  },
  {
    id: 'group-16',
    name: 'Extension Group #6',
    count: 10,
  },
]
export interface Extension {
  siNo?: number
  extension: string
  name: string
  email: string
  phoneNumber: string
  webPhone: string
  actions?: string

}
const loading = ref(false)
const data: Extension[] = [
  {
    siNo: 1,
    extension: '1001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phoneNumber: '123-456-7890',
    webPhone: '62343',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },
  {
    siNo: 2,
    extension: '1002',
    name: 'Jan Doe',
    email: 'Jan.doe@email.com',
    phoneNumber: '123-456-43290',
    webPhone: '62390',
  },

]

// api call form extension group
const { data: extensionGroup, status } = await useLazyAsyncData('extension-group-list', () =>
  useApi().get('extension-group'), {
  transform: (res) => {
    return res.data
  },
})

interface Meta {
  current_page: number
  per_page: number
  last_page: number
  total: number
}
const meta: Meta = {
  current_page: 1,
  per_page: 20,
  last_page: 1,
  total: 20,
}
</script>

<template>
  <ResizablePanelGroup
    id="handle-demo-group-1"
    direction="horizontal"
    class="h-full rounded-lg border mt-4"
  >
    <ResizablePanel id="handle-demo-panel-1" class="bg-primary p-[18px] " :default-size="25" :min-size="16">
      <div class="relative">
        <Input class="bg-white h-11" placeholder="Search Groups" />
        <Icon name="lucide:search" class="absolute text-gray-900 top-1/2 right-3 -translate-y-1/2" />
      </div>
      <Separator class="my-2 bg-[#FFFFFF1A]" />
      <ScrollArea class="h-[calc(100vh-280px)]">
        <Tabs orientation="vertical" class="space-y-2 h-full">
          <TabsList class="flex flex-col h-full gap-y-2 bg-transparent w-full">
            <TabsTrigger
              v-for="group in extensionGroup" :key="group.name" :value="group.id" class="min-h-[56px] w-full border border-[#FFFFFF1A] bg-[#FFFFFF0D] text-white data-[state=active]:bg-[#00A086] mr-2
               rounded-[8px] flex items-center justify-between px-[16px] !text-sm !font-normal cursor-pointer hover:bg-[#FFFFFF0D]/80 relative data-[state=inactive]:after:hidden after:absolute after:-right-[16px] after:border-8 after:border-transparent after:border-l-[#00A086] "
            >
              <div class="truncate">
                {{ group?.title }}
              </div>
              <div class="flex items-center gap-x-1">
                <div class="bg-[#FFFFFF14] px-2 py-1.5 flex items-center rounded-[6px] text-xs gap-x-1">
                  <Icon name="clarity:user-line" size="13" />
                  {{ group?.count }}
                </div>
                <Actions />
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </ScrollArea>
    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-1" with-handle />
    <ResizablePanel id="handle-demo-panel-2" :default-size="75" :min-size="50">
      <div class="px-[12px] py-[14px] flex justify-between items-center">
        <div class="font-medium text-[16px]">
          Extension Group #2
        </div>
        <div class="flex gap-x-2">
          <div class="relative">
            <Input placeholder="Search List" class="h-11 w-[250px]" />
            <Icon name="lucide:search" class="absolute text-gray-900 top-1/2 right-3 -translate-y-1/2" />
          </div>

          <UserManagementGroupAddExtension />
        </div>
      </div>
      <div class="h-[calc(100vh-280px)] overflow-y-auto">
        <UserManagementGroupTable :list="data" :meta="meta" />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>

  <div class=" flex items-center justify-end space-x-2 py-4 flex-wrap">
    <div class="flex-1 text-xs text-primary">
      <div class="flex items-center gap-x-2 justify-center sm:justify-start">
        Showing {{ meta?.current_page }} to

        <span>
          <Select :default-value="10">
            <SelectTrigger class="w-fit gap-x-1 px-2">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="n in 15" :key="n" :value="n">
                {{ n }}
              </SelectItem>
            </SelectContent>
          </Select>
        </span>

        of {{ meta?.total }} entries
      </div>
    </div>
    <div class="space-x-2">
      <TableServerPagination
        :total-items="Number(meta?.total)" :current-page="Number(meta?.current_page)"
        :items-per-page="Number(meta?.per_page)" :last-page="Number(meta?.last_page)"
      />
    </div>
  </div>
</template>
