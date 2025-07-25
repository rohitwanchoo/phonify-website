<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

const isCollapsed = ref(false)
</script>

<template>
  <ResizablePanelGroup
    id="handle-demo-group-1"
    direction="horizontal"
    class="!h-[calc(100vh-160px)] rounded-2xl border"
  >
    <ResizablePanel
      id="handle-demo-panel-1" collapsible :collapsed-size="4.5" :default-size="265" :min-size="15"
      :max-size="20" @collapse="isCollapsed = true" @expand="isCollapsed = false"
    >
      <div class="flex h-full justify-center  bg-primary text-white" :class="isCollapsed ? 'p-2' : 'p-5'">
        <EmailResizablePanelNavigation :is-collapsed />
      </div>
    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-1" with-handle />
    <ResizablePanel id="handle-demo-panel-2" :min-size="29" :default-size="440">
      <div class="flex h-full">
        <EmailResizablePanelList />
      </div>
    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-2" with-handle />

    <ResizablePanel id="handle-demo-panel-3" :default-size="655">
      <div class="flex h-full justify-center p-3 bg-gray-50">
        <EmailResizablePanelCompose />
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
