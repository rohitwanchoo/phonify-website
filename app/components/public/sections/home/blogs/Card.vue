<script setup lang="ts">
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'

interface BlogData {
  id: number | null
  url: string
  title: string
  thumbnail: string
  description: string
  date: string
  author: string
  category: string
  loading: boolean
}

interface Props {
  data: BlogData
}

const props = defineProps<Props>()

const to = computed(() => {
  if (props.data?.url)
    return `/blogs/${encodeURIComponent(props.data?.url)}/`
  else
    return `/blogs/${encodeURIComponent(props.data?.title)}/`
})
</script>

<template>
  <div
    class="bg-white flex flex-col gap-4 border border-[#E7E5E4] p-4 relative overflow-hidden group transition-all duration-500 "
    @touchstart.stop=""
  >
    <div class="relative w-full overflow-hidden">
      <img
        :src="data?.thumbnail" :alt="data?.title"
        class="w-full h-[281px] object-cover transition-all duration-700 ease-out group-hover:blur-[1.5px] group-hover:scale-105"
      >

      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent " />

      <div
        class="absolute bottom-0 left-0 w-full flex justify-between items-end p-4 text-white text-xs sm:text-sm font-normal"
      >
        <p>{{ data?.category }}</p>
        <!-- <p>12 Mins Read</p> -->
      </div>

      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
      >
        <NuxtLink :to="to">
          <Button
            class="flex items-center gap-3 bg-[#D11E28] rounded-xs text-white font-medium px-5 py-2 shadow-md transform translate-y-10 group-hover:translate-y-0 transition-all duration-500"
          >
            Read Article
            <img :src="dotArrow" alt="icon" class="size-4">
          </Button>
        </NuxtLink>
      </div>
    </div>

    <h1 class="text-lg font-semibold text-gray-900">
      {{ data?.title }}
    </h1>

    <p
      class="font-normal text-sm leading-relaxed text-gray-600 line-clamp-3 overflow-hidden"
      v-html="data?.description"
    />

    <div class="mt-auto">
      <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed my-4">
      <div class="text-sm text-gray-500 flex items-center gap-2">
        <span>{{ data?.date || 'Unknown' }}</span>
        <span class="inline-block size-1 bg-[#000000] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]" />
        <p>
          by <span class="font-semibold text-gray-900 underline">{{ data?.author || 'Unknown' }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
