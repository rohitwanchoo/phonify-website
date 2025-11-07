<script setup lang="ts">
import type { CarouselApi } from '@/components/ui/carousel'
import { watchOnce } from '@vueuse/core'
import Autoplay from 'embla-carousel-autoplay'
import { ref } from 'vue'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import quote from '~/assets/svg/public/quote.svg'

const reviews = [
  {
    name: 'Miranda Wyman',
    image: '/images/website/sections/reviews/profile1.png',
    position: 'Operations Manager',
    companyLogo: '/images/website/sections/reviews/company1.png',
    content: 'Phonify transformed how we manage outbound campaigns. Our agent productivity went up by 40% within the first month!',
  },
  {
    name: 'John Doe',
    image: '/images/website/sections/reviews/profile1.png',
    position: 'Sales Manager',
    companyLogo: '/images/website/sections/reviews/company1.png',
    content: 'Phonify has been a game-changer for our sales team. They helped us reach new customers and increase our revenue by 30%!',
  },
  {
    name: 'Mark Zuckerberg',
    image: '/images/website/sections/reviews/profile1.png',
    position: 'Founder - Meta',
    companyLogo: '/images/website/sections/reviews/company1.png',
    content: 'Phonify helped optimize workflows and scaling efficiently!',
  },
  {
    name: 'Elon Musk',
    image: '/images/website/sections/reviews/profile1.png',
    position: 'Founder - Tesla',
    companyLogo: '/images/website/sections/reviews/company1.png',
    content: 'Amazing customer engagement and automation.',
  },
]

const emblaMainApi = ref<CarouselApi>()
const emblaThumbnailApi = ref<CarouselApi>()
const selectedIndex = ref(0)

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value)
    return
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap()
  emblaThumbnailApi.value.scrollTo(selectedIndex.value)
}

function onThumbClick(index: number) {
  emblaMainApi.value?.scrollTo(index)
}

watchOnce(emblaMainApi, (api) => {
  if (!api)
    return
  onSelect()
  api.on('select', onSelect)
  api.on('reInit', onSelect)
})

const plugin = Autoplay({
  delay: 2000,
  stopOnMouseEnter: true,
  stopOnInteraction: false,
})
</script>

<template>
  <div class="w-full bg-white">
    <div class="max-w-[1440px] mx-auto px-4 md:px-28 py-8 md:py-24">
      <!-- Main Carousel -->
      <Carousel
        :plugins="[plugin]"
        @init-api="(val) => emblaMainApi = val"
      >
        <CarouselContent>
          <CarouselItem v-for="(review, index) in reviews" :key="index">
            <div class="px-0 md:px-[200px] flex flex-col items-center">
              <img :src="quote" alt="icon">
              <p class="text-center text-stone-800 text-base md:text-3xl leading-6 md:leading-10 mb-5 md:mb-10 mt-5">
                {{ review.content }}
              </p>

              <div class="flex flex-col items-center">
                <img :src="review.image" class="w-20 h-20 rounded-full object-cover">
                <p class="mt-6 text-stone-900 text-xl font-medium">
                  {{ review.name }}
                </p>
                <p class="text-stone-700 text-xs mt-2">
                  {{ review.position }}
                </p>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <!-- Thumbnails / Company Logos -->
      <Carousel
        class="w-full py-2 mt-6 md:mt-[54px] mb-6 md:mb-[66px]"
        :opts="{ align: 'center', containScroll: 'trimSnaps' }"
        @init-api="(val) => emblaThumbnailApi = val"
      >
        <CarouselContent class="flex justify-center w-full">
          <CarouselItem
            v-for="(review, index) in reviews"
            :key="index"
            class="basis-1/3 md:basis-1/5 cursor-pointer flex justify-center"
            @click="onThumbClick(index)"
          >
            <div
              class="flex items-center justify-center transition-all w-fit md:w-32 h-6"
              :class="selectedIndex === index ? 'opacity-100 border-black scale-100' : 'opacity-40 hover:opacity-70 border-transparent scale-90'"
            >
              <img :src="review.companyLogo" class="h-6 object-contain">
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div class="w-full flex items-center justify-center overflow-x-auto">
        <div class="relative w-full max-w-[700px] h-[1px] bg-zinc-300">
          <div
            class="absolute left-0 top-0 h-[1px] bg-black transition-all duration-500 ease-out"
            :style="{
              width: `${((selectedIndex + 1) / reviews.length) * 100}%`,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
