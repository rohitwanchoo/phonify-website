<script setup lang="ts">
definePageMeta({
  layout: 'website',
})

const privacyPolicy = [
  {
    title: 'Introduction and Scope',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim. Praesent luctus, ex a volutpat tincidunt, lectus turpis vestibulum quam, id pretium enim quam nec ligula. Nullam sit amet turpis eget odio facilisis interdum. Donec at elit at nisl feugiat faucibus.um.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim. Praesent luctus, ex a volutpat tincidunt, lectus turpis vestibulum quam, id pretium enim quam nec ligula. Nullam sit amet turpis eget odio facilisis interdum. Donec at elit at nisl feugiat faucibus.um.',
  },
  {
    title: 'Information We Collect',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim. Praesent luctus, ex a volutpat tincidunt, lectus turpis vestibulum quam, id pretium enim quam nec ligula. Nullam sit amet turpis eget odio facilisis interdum. Donec at elit at nisl feugiat faucibus.um.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim. Praesent luctus, ex a volutpat tincidunt, lectus turpis vestibulum quam, id pretium enim quam nec ligula. Nullam sit amet turpis eget odio facilisis interdum. Donec at elit at nisl feugiat faucibus.um.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim. Praesent luctus, ex a volutpat tincidunt, lectus turpis vestibulum quam, id pretium enim quam nec ligula. Nullam sit amet turpis eget odio facilisis interdum. Donec at elit at nisl feugiat faucibus.um.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim. Praesent luctus, ex a volutpat tincidunt, lectus turpis vestibulum quam, id pretium enim quam nec ligula. Nullam sit amet turpis eget odio facilisis interdum. Donec at elit at nisl feugiat faucibus.um.',
  },
  {
    title: 'Third-Party Disclosure',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim. Praesent luctus, ex a volutpat tincidunt, lectus turpis vestibulum quam, id pretium enim quam nec ligula. Nullam sit amet turpis eget odio facilisis interdum. Donec at elit at nisl feugiat faucibus.um.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim. Praesent luctus, ex a volutpat tincidunt, lectus turpis vestibulum quam, id pretium enim quam nec ligula. Nullam sit amet turpis eget odio facilisis interdum. Donec at elit at nisl feugiat faucibus.um.',
  },
]

const activeSection = ref(0)

// Scroll to section
function scrollToSection(ind: number) {
  const target = document.getElementById(`section-${ind}`)
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
    rootMargin: `-${navbarHeight + offset}px 0px -50% 0px`,
    threshold: 0,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id
        const sectionIndex = Number.parseInt(id.replace('section-', ''))
        if (!Number.isNaN(sectionIndex)) {
          activeSection.value = sectionIndex
        }
      }
    })
  }, observerOptions)

  // Observe all sections
  privacyPolicy.forEach((_, index) => {
    const section = document.getElementById(`section-${index}`)
    if (section) {
      observer.observe(section)
    }
  })

  // Cleanup observer on unmount
  onUnmounted(() => {
    observer.disconnect()
  })
}

onMounted(() => {
  // Wait for DOM to render
  nextTick(() => {
    setTimeout(() => {
      observeSections()
    }, 100)
  })
})
</script>

<template>
  <div class="w-full px-4 lg:px-28 py-8 lg:py-16 bg-white">
    <div class="max-w-[1440px] mx-auto space-y-8 lg:space-y-10">
      <div class="flex flex-col gap-3 lg:gap-5 items-start lg:items-center">
        <h1 class="text-stone-900 text-2xl lg:text-5xl font-medium">
          Privacy Policy
        </h1>
        <p class="max-w-[678px] w-full text-start lg:text-center text-stone-700 text-xl font-extralight">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id tellus ac sem ultricies finibus ac a enim.
        </p>
      </div>
      <hr class="hidden lg:blocck w-full h-[0.50px] border-[0.50px] border-zinc-300 border-dashed">
      <div class="flex items-start justify-between">
        <div class="min-w-[280px] max-w-md px-6 pt-8 sticky top-[120px] h-fit hidden lg:block">
          <h6 class="pt-4 pb-3 text-zinc-800">
            Privacy Policy
          </h6>
          <div class="flex flex-col">
            <NuxtLink
              v-for="(item, index) in privacyPolicy" :key="index"
              class="w-full pl-4 py-2 text-stone-600 text-sm font-normal border-l border-zinc-300 bg-white hover:underline cursor-pointer transition-all"
              :class="{ 'bg-gradient-to-r from-red-600/10 to-red-600/0 border-l-2 !border-[#D11E28] text-stone-800 font-medium': activeSection === index }"
              @click="scrollToSection(index)"
            >
              {{ index + 1 }}. {{ item.title }}
            </NuxtLink>
          </div>
        </div>
        <ul class="px-0 lg:px-6 py-8 border-0 lg:border-l border-zinc-300 space-y-6">
          <li
            v-for="(item, index) in privacyPolicy"
            :id="`section-${index}`"
            :key="index"
            class="pb-4 inline-flex flex-col justify-start items-start gap-4"
          >
            <h2 class="text-zinc-800 text-xl lg:text-2xl">
              {{ index + 1 }}. {{ item.title }}
            </h2>
            <p class="text-stone-600">
              {{ item.content }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
