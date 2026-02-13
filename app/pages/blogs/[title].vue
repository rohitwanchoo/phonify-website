<script setup>
import dotArrow from '~/assets/svg/public/dotArrow.svg'
import { Button } from '~/components/ui/button'
import { sanitizeHtml } from '~/utils'

definePageMeta({
  layout: 'website',
})

const route = useRoute()
const router = useRouter()

const data = ref(null)
const loading = ref(false)
const tableOfContents = ref([])
const activeSection = ref(null)

// Extract table of contents from HTML content
async function extractTableOfContents() {
  // Wait for DOM to update
  await nextTick()
  // Add a small delay to ensure v-html has rendered
  await new Promise(resolve => setTimeout(resolve, 100))

  const container = document.querySelector('.blog-content')
  if (container) {
    const headings = container.querySelectorAll('h2, h3')
    const toc = []
    let currentH2 = null

    headings.forEach((heading) => {
      const level = heading.tagName.toLowerCase()
      const text = heading.textContent.trim()
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      heading.id = id

      if (level === 'h2') {
        currentH2 = { text, id, subHeadings: [] }
        toc.push(currentH2)
      }
      else if (level === 'h3' && currentH2) {
        currentH2.subHeadings.push({ text, id })
      }
      else if (level === 'h3') {
        toc.push({ text, id, subHeadings: [] })
      }
    })

    tableOfContents.value = toc
  }
}

// Scroll to section
function scrollToSection(id) {
  const target = document.getElementById(id)
  if (target) {
    const navbarHeight = 113
    const y = target.getBoundingClientRect().top + window.scrollY - navbarHeight
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

// Observe sections for active state
function observeSections() {
  const navbarHeight = 113
  const offset = 20
  const observerOptions = {
    root: null,
    rootMargin: `-${navbarHeight + offset}px 0px -100% 0px`,
    threshold: 0,
  }

  const observer = new IntersectionObserver((entries) => {
    const visibleHeadings = []

    entries.forEach((entry) => {
      if (entry.isIntersecting)
        visibleHeadings.push({ id: entry.target.id, top: entry.boundingClientRect.top })
    })

    if (visibleHeadings.length > 0) {
      visibleHeadings.sort((a, b) => a.top - b.top)
      activeSection.value = visibleHeadings[0].id
    }
  }, observerOptions)

  document.querySelectorAll('.blog-content h2, .blog-content h3').forEach((section) => {
    observer.observe(section)
  })
}

// Format date helper
function formatDate(dateString) {
  if (!dateString)
    return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  loading.value = true
  try {
    const { data: blog } = await $fetch(`https://api.iocod.com/api/show-blog/${route.params.title}`, {
      method: 'post',
    })
    data.value = blog
  }
  catch (error) {
    console.error('Error fetching blog:', error)
  }
  finally {
    loading.value = false
  }
})

// Watch for data changes and extract TOC after render
watch(data, async (newData) => {
  if (newData) {
    await extractTableOfContents()
    observeSections()
  }
})
</script>

<template>
  <div class="w-full bg-white">
    <div v-if="loading" class="flex justify-center items-center min-h-screen">
      <div class="w-12 aspect-square border-4 border-zinc-200 rounded-full border-b-red-600 animate-spin" />
    </div>

    <template v-else-if="data">
      <div class="max-w-[1440px] mx-auto px-4 lg:px-28 pt-8 lg:pt-16">
        <div class="flex flex-col justify-center items-center gap-4 lg:gap-5 mb-4 lg:mb-10">
          <div class="w-full justify-start">
            <NuxtLink class="flex justify-start items-center gap-1 text-stone-900 text-sm lg:text-base cursor-pointer" @click.prevent="router.back()">
              <Icon name="material-symbols:arrow-back-ios-new" class="text-stone-900 text-sm lg:text-base" />
              Back
            </NuxtLink>
          </div>
          <p v-if="data?.category" class="justify-start text-red-600 text-sm lg:text-base font-light leading-6">
            {{ data?.category }}
          </p>
          <h1 class="text-center justify-start text-stone-900 text-2xl lg:text-5xl font-medium">
            {{ data?.title }}
          </h1>
          <div class="flex justify-start items-center gap-3">
            <p class="text-stone-600 text-sm lg:text-lg font-light line-clamp-6">
              {{ formatDate(data?.date) }}
            </p>
            <div class="size-1 bg-black mx-1.5" />
            <p class="text-sm lg:text-lg font-light line-clamp-6">
              <span class="text-stone-600">by </span>
              <span class="text-stone-800 font-medium underline">{{ data?.author_name }}</span>
            </p>
          </div>
        </div>
        <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">
        <img
          class="h-[500px] w-full object-cover rounded-sm my-6 lg:my-10"
          :src="data?.thumbnail"
          :alt="data?.title"
        >
        <hr class="w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">
      </div>

      <div class="max-w-[1440px] mx-auto px-6 lg:px-28 py-8 lg:py-24 flex items-start gap-10">
        <!-- Table of Contents Sidebar -->
        <div class="min-w-[280px] max-w-md sticky top-[120px] h-fit hidden lg:flex flex-col justify-start items-start gap-8">
          <div
            v-for="(item, index) in tableOfContents"
            :key="index"
            class="flex-col justify-start items-start flex"
          >
            <div class="justify-start items-start gap-2 flex">
              <NuxtLink
                class="text-stone-600 text-base font-normal hover:underline cursor-pointer text-left px-4 py-2.5 border-l border-zinc-200"
                :class="{ 'text-stone-800 font-medium border-l-2 !border-red-600': activeSection === item?.id }"
                @click="scrollToSection(item?.id)"
              >
                {{ item?.text }}
              </NuxtLink>
            </div>
            <div
              v-for="(subItem, subIndex) in item?.subHeadings"
              :key="subIndex"
              class="self-stretch justify-start items-start gap-2.5 inline-flex"
            >
              <NuxtLink
                class="grow shrink basis-0 text-stone-600 text-base font-normal hover:underline cursor-pointer text-left px-4 py-2.5 border-l border-zinc-200"
                :class="{ 'underline text-stone-800 font-medium border-l-2 !border-red-600': activeSection === subItem?.id }"
                @click="scrollToSection(subItem?.id)"
              >
                {{ subItem?.text }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Blog Content -->
        <div class="blog-content flex-1">
          <div
            class="flex flex-col justify-start items-start text-stone-600 text-base font-normal leading-8 prose prose-stone max-w-none"
            v-html="sanitizeHtml(data?.description)"
          />
        </div>
      </div>

      <div class="w-full px-4 lg:px-28 py-8 lg:py-24 bg-[#F8F3F0] overflow-hidden">
        <div class="max-w-[1440px] mx-auto flex flex-col justify-start items-center gap-6 lg:gap-16">
          <div class="w-full flex items-center justify-between">
            <h2 class="text-stone-900 text-2xl lg:text-5xl font-medium">
              Related Blogs
            </h2>
            <NuxtLink to="/blogs">
              <Button class="hidden lg:flex w-full lg:w-fit h-12 px-6 py-3 bg-[#1F1E1C] text-white hover:bg-[#33312F] rounded-xs">
                View more
                <img :src="dotArrow" alt="icon" class="size-4">
              </Button>
            </NuxtLink>
          </div>

          <div v-if="data.related_posts && data.related_posts.length" class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-10">
            <PublicSectionsHomeBlogsCard
              v-for="i in data?.related_posts?.length"
              :key="i"
              :data="data?.related_posts[i - 1]"
            />
          </div>

          <NuxtLink to="/blogs">
            <Button class="lg:hidden w-full lg:w-fit h-12 px-6 py-3 bg-[#1F1E1C] text-white hover:bg-[#33312F] rounded-xs">
              View more
              <img :src="dotArrow" alt="icon" class="size-4">
            </Button>
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}

.blog-content :deep(h2) {
  color: #3f3f46;
  font-size: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}
@media (min-width: 1024px) {
  .blog-content :deep(h2) {
    font-size: 1.5rem;
  }
}
.blog-content :deep(h2) {
  font-weight: 400;
}

.blog-content :deep(h3) {
  color: #3f3f46;
  font-size: 1.125rem;
  margin-top: 1rem;
  margin-bottom: 0.75rem;
}
@media (min-width: 1024px) {
  .blog-content :deep(h3) {
    font-size: 1.25rem;
  }
}
.blog-content :deep(h3) {
  font-weight: 400;
}

.blog-content :deep(p) {
  color: #52525b;
  font-size: 1rem;
  line-height: 1.5rem;
  margin-bottom: 1rem;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  color: #52525b;
  font-size: 1rem;
  line-height: 1.5rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.blog-content :deep(img) {
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  width: 100%;
}
</style>
