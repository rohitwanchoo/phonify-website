<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

interface IpData {
  whitelist_ip: string
  user: string
  ip_location: string | null

}
const props = defineProps<{
  rowData?: IpData[]
}>()
</script>

<template>
  <Carousel class="relative w-full max-w-auto">
    <CarouselContent>
      <CarouselItem v-for="(item, index) in rowData" :key="index">
        <div class="p-1">
          <CardContent class="flex items-center justify-center text-wrap w-full px-0">
            <!-- <span class="text-4xl font-semibold">{{ index + 1 }}</span> -->
            <div class="text-center mt-4">
              <p class="text-xl font-semibold text-primary">
                Approve This IP!
              </p>
              <p class="text-sm text-primary  mt-1">
                You are about to approve this IP, do you wish to proceed?
              </p>
              <div class="relative h-[40px] flex items-center justify-center text-sm text-shadow-gray-200">
                <CarouselPrevious class="left-0 border-gray-200 bg-gray-100 z-10" />
                {{ index + 1 }} of {{ rowData?.length }}
                <CarouselNext class=" right-0 border-gray-200 bg-gray-100 z-10" />
              </div>
              <div v-if="props.rowData" class="space-y-2 mb-4">
                <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
                  <p class="text-sm text-muted-foreground">
                    Ip Address
                  </p>
                  <p class="text-sm text-primary">
                    {{ item.whitelist_ip }}
                  </p>
                </div>
                <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
                  <p class="text-sm text-muted-foreground">
                    User
                  </p>
                  <p class="text-sm text-primary">
                    {{ item.user }}
                  </p>
                </div>
                <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
                  <p class="text-sm text-muted-foreground">
                    Location
                  </p>
                  <p class="text-sm text-primary">
                    {{ item.ip_location || '-' }}
                  </p>
                </div>
              </div>
              <div v-else class="text-sm text-muted-foreground py-4">
                No data available
              </div>
            </div>
          </CardContent>
        </div>
      </CarouselItem>
    </CarouselContent>
  </Carousel>
</template>
