<script setup lang="ts">
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const props = defineProps<{
  templateHtml?: string
}>()

const open = defineModel<boolean>()
</script>

<template>
  <Sheet
    v-model:open="open"
  >
    <SheetContent class="min-w-[320px] scroll-auto md:min-w-[600px] gap-0">
      <Tabs default-value="desktop" class="w-full gap-0">
        <!-- Header with triggers -->
        <div class="flex items-center justify-between px-5 py-6 bg-slate-800 shadow-md">
          <SheetTitle class="text-white text-xl font-medium">
            Email Preview
          </SheetTitle>
          <TabsList class="flex space-x-1 bg-white/10 rounded-md p-0.5">
            <TabsTrigger
              value="desktop"
              class="data-[state=active]:bg-white text-white data-[state=active]:text-black data-[state=active]:shadow text-sm px-3 py-1 rounded-md"
            >
              <Icon name="material-symbols:computer-outline" size="20" />
            </TabsTrigger>
            <TabsTrigger
              value="mobile"
              class="data-[state=active]:bg-white text-white data-[state=active]:text-black data-[state=active]:shadow text-sm px-3 py-1 rounded-md"
            >
              <Icon name="material-symbols:smartphone-outline" size="20" />
            </TabsTrigger>
          </TabsList>
          <SheetClose />
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[calc(100vh-66px)] p-4">
          <TabsContent value="desktop">
            <div class="flex justify-center">
              <div class="w-[480px]">
                <div v-html="props?.templateHtml" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="mobile">
            <div class="flex justify-center">
              <div class="w-80">
                <div v-html="props?.templateHtml" />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </SheetContent>
  </Sheet>
</template>
