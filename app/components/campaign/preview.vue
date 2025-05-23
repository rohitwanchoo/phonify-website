<script setup lang="ts">
import { Button } from '~/components/ui/button'
</script>

<template>
  <div class=" relative h-[calc(100vh-190px)] overflow-hidden">
    <div class="m-5 space-y-[16px]">
      <div class="flex items-center justify-between">
        <div class="font-medium text-[20px]">
          Preview Campaign
        </div>
        <div class="flex items-center gap-x-1 text-green-600 text-[16px]">
          <Icon name="stash:circle-dot" size="20" />
          Active
        </div>
      </div>

      <div class=" bg-white rounded-lg border border-gray-100">
        <div class="flex items-center justify-between border-b pt-[25px] px-5 pb-[17px]">
          <h2 class="text-[16px] font-medium">
            Caller Details
          </h2>
          <Button variant="outline" class="">
            <Icon name="lucide:square-pen"></Icon>
            Edit
          </Button>
        </div>

        <div class="grid grid-cols-2 gap-6 p-5">
          <!-- Caller ID Section -->
          <div class="space-y-2">
            <p class="text-xs text-gray-500">
              Name
            </p>
            <p class="text-[16px] font-normal text-gray-900">
              Custom
            </p>
          </div>

          <!-- Custom Caller ID Section -->
          <div class="space-y-2">
            <p class="text-xs text-gray-500">
              Custom Caller ID
            </p>
            <p class="text-[16px] font-normal text-gray-900">
              873283632879
            </p>
          </div>

          <!-- Dialing Mode Section -->
          <div class="space-y-2">
            <p class="text-xs text-gray-500">
              Dialing Mode
            </p>
            <p class="text-[16px] font-normal text-gray-900">
              Super Power Dial
            </p>
          </div>

          <!-- Caller Group Section -->
          <div class="space-y-2">
            <p class="text-xs text-gray-500">
              Caller Group
            </p>
            <p class="text-[16px] font-normal text-gray-900">
              Agents Group #2
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="sticky bottom-0 right-0 w-full bg-white shadow-2xl p-4">
      <Button class="w-full h-[52px]" type="submit" @click="onSubmit">
        Continue
      </Button>
    </div> -->
  </div>
</template>
