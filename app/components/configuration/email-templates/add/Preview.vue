<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const props = defineProps<{
  templateHtml?: string
}>()
</script>

<template>
  <div class=" w-full xl:w-[480px] bg-white rounded-xl outline outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-start overflow-hidden">
    <Tabs default-value="desktop" class="w-full gap-0">
      <!-- Header with triggers -->
      <div class="flex items-center justify-between px-5 py-3 bg-white border-b border-zinc-100">
        <div class="text-slate-800 text-base font-medium">
          Template Preview
        </div>
        <TabsList class="flex space-x-1 bg-slate-800/10 rounded-md p-0.5">
          <TabsTrigger
            value="desktop"
            class="data-[state=active]:bg-slate-800 text-black data-[state=active]:text-white data-[state=active]:shadow text-sm px-3 py-1 rounded-md"
          >
            <Icon name="material-symbols:computer-outline" size="20" />
          </TabsTrigger>
          <TabsTrigger
            value="mobile"
            class="data-[state=active]:bg-slate-800 text-black data-[state=active]:text-white data-[state=active]:shadow text-sm px-3 py-1 rounded-md"
          >
            <Icon name="material-symbols:smartphone-outline" size="20" />
          </TabsTrigger>
        </TabsList>
      </div>

      <!-- Content -->
      <div class="overflow-y-auto p-5 h-[calc(100vh-250px)]">
        <TabsContent value="desktop">
          <div class="flex justify-center">
            <div class="w-[480px] overflow-hidden border rounded-lg border-zinc-100 p-1">
              <div v-html="props?.templateHtml" />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="mobile">
          <div class="flex justify-center">
            <div class="w-80 overflow-hidden border rounded-lg border-zinc-100 p-1">
              <div v-html="props?.templateHtml" />
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  </div>
</template>
