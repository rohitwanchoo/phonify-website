<script setup>
import { Button } from '~/components/ui/button'

const route = useRoute()

const productItems = [
  { name: 'Platform Overview', link: '/product', icon: 'lucide:layout-dashboard', description: 'See the full platform' },
  { name: 'AI Voice Agents', link: '/product#ai-voice', icon: 'lucide:bot', description: 'Automated call handling' },
  { name: 'Call Automation', link: '/product#dialer', icon: 'lucide:phone-outgoing', description: 'Predictive dialer & more' },
  { name: 'Omnichannel', link: '/product#omnichannel', icon: 'lucide:layers', description: 'SMS, email, voicemail' },
  { name: 'Analytics', link: '/product#analytics', icon: 'lucide:bar-chart-3', description: 'Real-time insights' },
  { name: 'Integrations', link: '/product#integrations', icon: 'lucide:plug', description: '50+ native connections' },
]

const solutionItems = [
  { name: 'Call Centers', link: '/solutions/call-centers', icon: 'lucide:headphones', description: 'Scale without hiring' },
  { name: 'Sales Teams', link: '/solutions/sales-teams', icon: 'lucide:trending-up', description: 'Close more deals' },
  { name: 'Support Teams', link: '/solutions/support-teams', icon: 'lucide:life-buoy', description: 'Resolve faster' },
  { name: 'Agencies', link: '/solutions/agencies', icon: 'lucide:building', description: 'Multi-client management' },
]

const items = [
  { name: 'Pricing', link: '/pricing' },
  { name: 'Enterprise', link: '/enterprise' },
  { name: 'Security', link: '/security' },
]

const productOpen = ref(false)
const solutionsOpen = ref(false)
</script>

<template>
  <div class="w-full px-4 lg:px-0 pt-8 lg:pt-0 pb-6 lg:pb-0 bg-gray-50 lg:bg-white flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-6">
    <ul class="flex flex-col lg:flex-row items-center gap-1 lg:gap-2">
      <!-- Product Dropdown -->
      <li class="relative">
        <button
          class="flex items-center gap-1 px-3 py-2 text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
          @mouseenter="productOpen = true"
          @mouseleave="productOpen = false"
        >
          Product
          <Icon name="lucide:chevron-down" class="w-4 h-4 transition-transform" :class="productOpen ? 'rotate-180' : ''" />
        </button>
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-show="productOpen"
            class="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50"
            @mouseenter="productOpen = true"
            @mouseleave="productOpen = false"
          >
            <NuxtLink
              v-for="item in productItems"
              :key="item.link"
              :to="item.link"
              class="flex items-start gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
              @click="productOpen = false"
            >
              <div class="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon :name="item.icon" class="w-4 h-4 text-stone-600" />
              </div>
              <div>
                <div class="text-sm font-medium text-stone-900">{{ item.name }}</div>
                <div class="text-xs text-stone-500">{{ item.description }}</div>
              </div>
            </NuxtLink>
          </div>
        </Transition>
      </li>

      <!-- Solutions Dropdown -->
      <li class="relative">
        <button
          class="flex items-center gap-1 px-3 py-2 text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg transition-colors"
          @mouseenter="solutionsOpen = true"
          @mouseleave="solutionsOpen = false"
        >
          Solutions
          <Icon name="lucide:chevron-down" class="w-4 h-4 transition-transform" :class="solutionsOpen ? 'rotate-180' : ''" />
        </button>
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-show="solutionsOpen"
            class="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50"
            @mouseenter="solutionsOpen = true"
            @mouseleave="solutionsOpen = false"
          >
            <NuxtLink
              v-for="item in solutionItems"
              :key="item.link"
              :to="item.link"
              class="flex items-start gap-3 px-4 py-3 hover:bg-stone-50 transition-colors"
              @click="solutionsOpen = false"
            >
              <div class="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon :name="item.icon" class="w-4 h-4 text-stone-600" />
              </div>
              <div>
                <div class="text-sm font-medium text-stone-900">{{ item.name }}</div>
                <div class="text-xs text-stone-500">{{ item.description }}</div>
              </div>
            </NuxtLink>
          </div>
        </Transition>
      </li>

      <!-- Regular Items -->
      <li
        v-for="item in items"
        :key="item.link"
        class="px-3 py-2 text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
        :class="route.path === item.link ? 'text-stone-900 bg-stone-50' : ''"
      >
        <NuxtLink :to="item.link">
          {{ item.name }}
        </NuxtLink>
      </li>
    </ul>

    <!-- CTAs -->
    <div class="w-full lg:w-fit flex flex-col lg:flex-row items-center gap-3">
      <NuxtLink to="/auth/login" class="hidden lg:block">
        <Button variant="ghost" class="h-10 px-4 text-stone-700 hover:text-stone-900 font-medium">
          Sign in
        </Button>
      </NuxtLink>
      <NuxtLink to="/auth/signup" class="w-full lg:w-fit">
        <Button variant="outline" class="h-10 w-full lg:w-fit px-4 border-stone-300 text-stone-700 rounded-lg font-medium hidden lg:flex">
          Start Free Trial
        </Button>
      </NuxtLink>
      <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank" class="w-full lg:w-fit">
        <Button class="h-10 w-full lg:w-fit px-5 bg-[#D11E28] hover:bg-[#b91c24] rounded-lg text-white font-medium">
          Book a Demo
        </Button>
      </NuxtLink>
    </div>
  </div>
</template>
