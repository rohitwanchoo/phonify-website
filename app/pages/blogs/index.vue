<script setup lang="ts">
// import { useDebounceFn } from '@vueuse/core'

definePageMeta({
  layout: 'website',
})

// const search = ref('')

// const debouncedSearch = useDebounceFn(() => {
// }, 1000, { maxWait: 5000 })

// function searchText() {
//   debouncedSearch()
// }
</script>

<template>
  <main class="w-full bg-white">
    <!-- <div class="max-w-[1440px] mx-auto w-full px-4 lg:px-28 mt-8 lg:mt-16 flex flex-col justify-center items-center">
      <div class="flex flex-col justify-start items-center gap-3 lg:gap-5 mb-4 lg:mb-10">
        <h1 class="text-center text-stone-900 text-2xl lg:text-5xl font-medium capitalize">
          Lorem ipsum dolor sit amet. <br>Non eget in viverra.
        </h1>
        <p class="max-w-[678px] text-center text-stone-700 text-base lg:text-xl font-extralight leading-6 lg:leading-8">
          Boost agent productivity and efficiency with our advanced dialer that automates and streamlines outbound calls.
        </p>
      </div>
      <BaseInputSearch v-model="search" classes="mb-0 lg:mb-10 w-full max-w-96 bg-[#F4F4F6] rounded-sm" placeholder="Search" @update:model-value="searchText" />
      <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed mb-10 hidden lg:block">
      <PublicSectionsBlogsFeatured class="hidden lg:block" />
    </div> -->
    <PublicSectionsBlogsCategories />
  </main>
</template>
