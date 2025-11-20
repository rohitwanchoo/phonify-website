<script setup>
import { Button } from '~/components/ui/button'

const route = useRoute()
const router = useRouter()

const currentPage = ref(1)
const pageCount = ref(1)
const blogsPerPage = 9

const currentPageBlogs = ref([])
const loading = ref(false)

async function fetchBlogs() {
  loading.value = true

  try {
    const { data, total_items } = await $fetch('https://api.iocod.com/api/list-blogs', {
      method: 'post',
      body: {
        page: currentPage.value,
        per_page: blogsPerPage,
        category: route?.query?.tab || undefined,
      },
    })
    currentPageBlogs.value = data || []
    pageCount.value = Math.ceil(total_items / blogsPerPage)
  }
  catch (err) {
    showToast({
      message: err.message,
      type: 'error',
    })
    currentPageBlogs.value = []
  }
  finally {
    loading.value = false
  }
}

function handlePageUpdate(newPage) {
  currentPage.value = newPage
  window.scrollTo({ top: 0, behavior: 'smooth' })
  fetchBlogs()
}

const tabList = [
  {
    label: 'All Category',
    value: null,
  },
  {
    label: 'Blogs',
    value: 'blogs',
  },
  {
    label: 'Events',
    value: 'events',
  },
  {
    label: 'News',
    value: 'news',
  },
]

function handleTabClick(tabValue) {
  currentPage.value = 1
  if (tabValue) {
    router.replace({ query: { tab: tabValue } })
  }
  else {
    router.replace({ query: {} })
  }
}

function isActiveTab(tabValue) {
  if (tabValue === null) {
    return !route?.query?.tab
  }
  return route?.query?.tab === tabValue
}

// Watch for route changes and fetch blogs
watch(() => route.query.tab, () => {
  fetchBlogs()
}, { immediate: true })

// SEO Meta tags
useHead({
  title: computed(() => {
    const category = route?.query?.tab
    return category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} - Blog`
      : 'All Blogs'
  }),
  meta: [
    {
      name: 'description',
      content: 'Boost agent productivity and efficiency with our advanced dialer that automates and streamlines outbound calls.',
    },
  ],
})
</script>

<template>
  <div class="max-w-[1440px] mx-auto w-full px-4 lg:px-28 py-8 lg:py-16 space-y-6 lg:space-y-10">
    <!-- Header Section -->
    <div class="flex gap-3 flex-col lg:flex-row lg:justify-between lg:items-center">
      <h1 class="text-stone-900 text-xl lg:text-5xl font-medium capitalize">
        Blogs
      </h1>
      <p class="max-w-xl text-stone-700 text-base lg:text-xl font-extralight leading-8">
        Boost agent productivity and efficiency with our advanced dialer that automates and streamlines outbound calls.
      </p>
    </div>

    <!-- Category Tabs -->
    <div
      class="flex items-center lg:justify-center gap-5 overflow-x-auto pb-2 lg:pb-0"
      role="tablist"
      aria-label="Blog categories"
    >
      <Button
        v-for="category in tabList"
        :key="category.label"
        :variant="isActiveTab(category.value) ? 'default' : 'outline'"
        :class="isActiveTab(category.value) ? 'bg-stone-900' : 'border-stone-300 text-stone-700'"
        :aria-selected="isActiveTab(category.value)"
        role="tab"
        class="h-12 rounded-xs whitespace-nowrap"
        @click="handleTabClick(category.value)"
      >
        {{ category.label }}
      </Button>
    </div>

    <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">

    <!-- Loading state -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in blogsPerPage" :key="n" class="bg-white border border-[#E7E5E4] p-4">
        <BaseSkelton class="w-full aspect-video mb-4" rounded="rounded-sm" />
        <BaseSkelton class="h-6 w-3/4 mb-2" />
        <BaseSkelton class="h-4 w-full mb-2" />
        <BaseSkelton class="h-4 w-2/3" />
      </div>
    </div>

    <!-- Blog Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <PublicSectionsHomeBlogsCard
        v-for="card in currentPageBlogs"
        :key="card?.id"
        :data="card"
      />
    </div>

    <!-- Pagination -->
    <div v-if="!loading && pageCount > 1" class="flex justify-center">
      <PublicBasePagination
        :current-page="currentPage"
        :page-count="pageCount"
        @change="handlePageUpdate"
      />
    </div>
  </div>
</template>
