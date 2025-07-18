<!-- <script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

import { ScrollArea } from '@/components/ui/scroll-area'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'

const extensionGroup = [
  {
    id: 1,
    title: 'Vanessa Bogan',
    number: '+1 (569) 912-3502',
    time: '10.00 am',
  },
  {
    id: 23,
    title: 'Guy Runolfsson',
    number: '+1 (422) 812-2211',
    time: '10.00 am',
  },
  {
    id: 24,
    title: 'Rodolfo Abbott',
    number: '+1 (712) 555-7832',
    time: '10.00 am',
  },
  {
    id: 37,
    title: 'Shelia Powlowski',
    number: '+1 (335) 199-1342',
    time: '10.00 am',
  },
  {
    id: 38,
    title: 'Unknown User',
    number: '+1 (569) 912-3502',
    time: '10.00 am',
  },
  {
    id: 39,
    title: 'Lisa Price',
    number: '+1 (789) 432-9981',
    time: '10.00 am',
  },
  {
    id: 40,
    title: 'Cameron Bergnaum',
    number: '+1 (556) 102-4433',
    time: '10.00 am',
  },
]

const messages = [
  {
    sender: 'me',
    text: 'enthallaaa?',
    time: '10.00 am',
  },
  {
    sender: 'them',
    text: 'sugam.',
    time: '10.01 am',
  },
  {
    sender: 'me',
    text: 'aysheri,verenthallaaa?',
    time: '10.01 am',
  },
  {
    sender: 'them',
    text: 'oo,anganoke pon..',
    time: '10.02 am',
  },
]

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 3,
}
</script>

<template>
  <ResizablePanelGroup direction="horizontal" class="h-full rounded-lg border mt-4">
    <ResizablePanel class="bg-primary p-[18px]" :default-size="25" :min-size="16">
      <div class="flex items-center gap-3 mb-4">
        <div class="relative flex-1">
          <Input class="bg-white h-11 pr-10" placeholder="Search here..." />
          <Icon name="lucide:search" class="absolute text-gray-900 top-1/2 right-3 -translate-y-1/2" />
        </div>
        <Button class="bg-black text-white h-11 px-3 border border-white">
          <Icon name="material-symbols:sort" class="text-white" size="23" />
        </Button>
      </div>

      <Separator class="my-2 bg-[#FFFFFF1A]" />

      <ScrollArea class="h-[calc(100vh-260px)]">
        <Tabs orientation="vertical" class="space-y-2 h-full">
          <TabsList class="flex flex-col h-full gap-y-2 bg-transparent w-full">
            <TabsTrigger
              v-for="group in extensionGroup"
              :key="group.id"
              :value="group.id"
              class="min-h-[56px] w-full border border-[#FFFFFF1A] bg-[#FFFFFF0D] text-white data-[state=active]:bg-[#00A086] mr-2 rounded-[8px] flex items-center justify-between px-[16px] !text-sm !font-normal cursor-pointer hover:bg-[#FFFFFF0D]/80 relative data-[state=inactive]:after:hidden after:absolute after:-right-[16px] after:border-8 after:border-transparent after:border-l-[#00A086]"
            >
              <div class="flex items-center gap-x-3 truncate">
                <div class="w-8 h-8 rounded-full bg-[#FFFFFF1A] text-white flex items-center justify-center text-xs font-semibold uppercase">
                  {{ group.title.split(' ').map(w => w[0]).join('').slice(0, 2) }}
                </div>
                <div class="truncate leading-tight">
                  <div class="truncate">
                    {{ group.title }}
                  </div>
                  <div class="text-xs text-white opacity-70">
                    {{ group.number }}
                  </div>
                </div>
              </div>

              <div class="text-xs text-white opacity-70 whitespace-nowrap">
                {{ group.time }}
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </ScrollArea>
    </ResizablePanel>

    <ResizableHandle with-handle />

    <ResizablePanel :default-size="75" :min-size="50" class="flex flex-col">
      <div class="px-4 py-3 border-b border-muted flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold">
            VB
          </div>
          <div class="leading-tight">
            <div class="font-medium">
              Vanessa Bogan
            </div>
            <div class="text-sm text-muted-foreground">
              +1 (569) 912–3502
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button class="bg-green-600 hover:bg-green-600 text-white text-sm px-2 py-2 rounded-md">
            <Icon name="material-symbols:call" class="text-white " size="20" />
            Call
          </Button>
          <Button class="text-sm px-2 py-2 rounded-md text-black bg-white hover:bg-white border border-black">
            <Icon name="material-symbols:demography" class="text-black" size="23" />
            Lead Activity
          </Button>
        </div>
      </div>

      <div
        class="flex-1 overflow-y-auto px-4 py-3 space-y-4"
        style="background-image: url('/images/chat-bg.png'); background-size: cover; background-repeat: repeat;"
      >

        <div class="w-full flex justify-center mt-2 mb-4">
          <div class="text-xs text-muted-foreground bg-[#E4E4E7] rounded-xl px-3 py-1 text-center">
            10.00 am
          </div>
        </div>

        <template v-for="(message, index) in messages" :key="index">
          <div v-if="message.sender === 'me'" class="flex justify-end">
            <div
              class="max-w-lg break-words bg-[#162D3A] text-white p-3 rounded-xl rounded-tr-none text-sm relative"
            >
              {{ message.text }}

              <div
                class="flex justify-end items-center gap-1 text-[10px] text-white opacity-70 mt-1"
              >
                {{ message.time }}
                <Icon name="material-symbols:done-all" class="text-white" size="14" />
              </div>
            </div>
          </div>

          <div v-else class="flex justify-start">
            <div
              class="max-w-lg break-words bg-[#E4E4E7] text-[#162D3A] p-3 rounded-xl rounded-tl-none text-sm"
            >
              {{ message.text }}
              <div
                class="text-right text-[10px] text-[#162D3A] opacity-70 mt-1 flex items-center justify-end gap-1"
              >
                {{ message.time }}
                <Icon name="material-symbols:done-all" class="text-[#162D3A]" size="14" />
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="bg-[#EBF5F3] px-4 py-2 border-t border-muted">
        <div class="text-sm text-muted-foreground">
          Send with
          <span class="text-primary font-medium">+1 (563) 536–84653</span>
          <Icon name="material-symbols:keyboard-arrow-down" size="20" />
        </div>
      </div>

      <div class="bg-white  border-t border-muted">
        <div class="relative w-full flex items-center">

          <Input
            placeholder="Send a message..."
            class="w-full  pr-[200px] py-10 border-none rounded-none bg-transparent
           placeholder:text-base placeholder:text-muted-foreground
           focus:outline-none focus:ring-0 focus:shadow-none"
          />

          <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-4">
            <button
              type="button"
              class="text-muted-foreground hover:text-black border border-black h-10 w-10 flex items-center justify-center rounded-sm"
            >
              <Icon name="material-symbols:attach-file" size="20" />
            </button>

            <button
              type="button"
              class="bg-[#0B2C3F] hover:bg-[#093142] text-white h-10 w-10 flex items-center justify-center rounded-sm"
            >
              <Icon name="material-symbols:send-outline" size="20" />
            </button>
          </div>
        </div>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template> -->
