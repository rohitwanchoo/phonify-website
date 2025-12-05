<script setup>
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'

const currentPage = ref(1)

const blogsPerPage = 6

const currentPageBlogs = ref([])
const loading = ref(false)

async function fetchBlogs() {
  loading.value = true
  try {
    const { data } = await $fetch('https://api.iocod.com/api/list-blogs', {
      method: 'post',
      body: {
        page: currentPage.value,
        per_page: blogsPerPage,
      },
    })
    currentPageBlogs.value = data
  }
  catch (error) {
    showToast({
      message: error.message,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBlogs()
})
</script>

<template>
  <div class="bg-[#F8F3F0]">
    <div class="max-w-[1440px] mx-auto flex flex-col gap-6 md:gap-16  px-4 md:px-28 py-8 md:py-24 ">
      <div class="flex flex-col gap-4 md:gap-5 text-start">
        <h1 class="font-light text-base">
          <span
            class="inline-block w-3 h-3 bg-[#D11E28] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
          />
          Blogs
        </h1>

        <div class="flex flex-col lg:flex-row justify-between">
          <h2 class="font-medium text-2xl sm:text-4xl md:text-5xl leading-tight">
            Explore Our Blog
          </h2>
          <p class="font-extralight text-base sm:text-lg md:text-xl">
            Dive into our blog for expert insights, tips, and industry
            <br class="hidden lg:block">
            trends to elevate your project management journey.
          </p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in blogsPerPage" :key="n" class="bg-white border border-[#E7E5E4] p-4">
          <BaseSkelton class="w-full aspect-video mb-4" rounded="rounded-sm" />
          <BaseSkelton class="h-6 w-3/4 mb-2" />
          <BaseSkelton class="h-4 w-full mb-2" />
          <BaseSkelton class="h-4 w-2/3" />
        </div>
      </div>

      <!-- Blog cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="card in currentPageBlogs" :key="card?.id">
          <PublicSectionsHomeBlogsCard
            :data="card"
            class="h-full"
          />
        </div>
      </div>

      <div class="flex justify-center">
        <NuxtLink to="/blogs">
          <Button class="w-full md:w-fit h-12 px-6 py-3 bg-[#1F1E1C] text-white hover:bg-[#33312F] rounded-xs">
            View more
            <img :src="dotArrow" alt="icon" class="size-4">
          </Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
