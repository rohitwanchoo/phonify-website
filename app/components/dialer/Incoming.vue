<script setup lang="ts">
import { Button } from '@/components/ui/button'

const emits = defineEmits(['accept', 'reject'])

const { callerDetails } = useSIPml5()
</script>

<template>
  <div class="bg-primary text-white text-center py-2 h-[600px]">
    <div class="absolute top-0 h-0.5 w-10 bg-white/50 left-1/2 -translate-x-1/2 cursor-pointer mt-2" />
    <div class="text-sm mt-3">
      Incoming Calls
      <div class="absolute top-3 right-2.5">
        <Button
          variant="ghost"
          size="sm"
          class="size-5 p-0 text-white hover:bg-white/10 mr-2"
        >
          <Icon name="material-symbols:close" class="text-xl" />
        </Button>
      </div>
    </div>
    <div class="px-auto mt-12">
      <img src="/assets/svg/dialer/user.svg" alt="user" class="w-13.5 h-13.5 mx-auto">
      <div class="mt-6">
        <div class="text-2xl font-medium">
          {{ callerDetails?.name }}
        </div>
        <div class="text-xs text-white/80 mt-2 text-[16px]">
          {{ callerDetails?.number }}
        </div>
      </div>
    </div>
    <div class="flex justify-between px-[51px] mt-[88%]">
      <Button
        class="bg-green-600 hover:bg-green-600 rounded-full size-[54px] p-0 disabled:opacity-50"
        @click="emits('accept')"
      >
        <Icon name="ion:call" class="text-2xl text-white" />
      </Button>
      <Button
        class="bg-red-600 hover:bg-red-600 rounded-full size-[54px] p-0"
        @click="emits('reject')"
      >
        <Icon name="ic:round-call-end" class="text-2xl text-white" />
      </Button>
    </div>
  </div>
</template>
