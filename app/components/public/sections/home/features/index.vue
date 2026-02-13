<script setup>
const features = [
  {
    icon: 'lucide:bot',
    label: 'AI Voice Agents',
    title: 'AI that speaks naturally and never sleeps',
    description: 'Deploy AI that speaks naturally, follows your scripts, and handles objections. Works 24/7 without breaks, sick days, or turnover.',
    image: '/images/website/sections/home/feature1.png',
    link: '/product#ai-voice',
  },
  {
    icon: 'lucide:phone-outgoing',
    label: 'Predictive Dialer',
    title: 'Dial 3x more leads with intelligent pacing',
    description: 'Auto-skip voicemails, detect answering machines, and connect reps only to live humans. More conversations, less waiting.',
    image: '/images/website/sections/home/feature2.png',
    link: '/product#dialer',
  },
  {
    icon: 'lucide:layers',
    label: 'Omnichannel Hub',
    title: 'Calls, SMS, email—one unified inbox',
    description: 'Every conversation in one place. No switching tabs, no lost context. Calls, SMS, ringless voicemail, and email seamlessly integrated.',
    image: '/images/website/sections/home/feature3-1.png',
    link: '/product#omnichannel',
  },
  {
    icon: 'lucide:bar-chart-3',
    label: 'Real-Time Analytics',
    title: 'Know what\'s working in seconds, not days',
    description: 'Live dashboards show call outcomes, agent performance, and campaign ROI. AI summarizes every call so managers don\'t have to listen.',
    image: '/images/website/sections/home/feature4.png',
    link: '/product#analytics',
  },
  {
    icon: 'lucide:shield-check',
    label: 'Enterprise Security',
    title: 'Compliance built-in, not bolted-on',
    description: 'SOC 2 compliant. HIPAA ready. TCPA built-in. User roles, IP limits, and activity logs managed with ease.',
    image: '/images/website/sections/home/feature5.png',
    link: '/security',
  },
]

const selectedFeature = ref(0)
</script>

<template>
  <section id="features" class="w-full bg-white py-16 lg:py-24 px-4">
    <div class="max-w-[1440px] mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
        <div class="max-w-2xl">
          <p class="text-[#D11E28] font-medium text-sm mb-4 flex items-center gap-2">
            <span class="w-2 h-2 bg-[#D11E28] rounded-full" />
            PLATFORM FEATURES
          </p>
          <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
            One platform. Every call channel.
          </h2>
          <p class="text-lg text-stone-600">
            Everything you need to automate voice at scale—without the enterprise complexity.
          </p>
        </div>
        <NuxtLink
          to="/product"
          class="inline-flex items-center text-[#D11E28] font-medium hover:text-red-700 transition-colors"
        >
          View all features
          <Icon name="lucide:arrow-right" class="w-5 h-5 ml-2" />
        </NuxtLink>
      </div>

      <!-- Features Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Feature Tabs -->
        <div class="lg:col-span-4 space-y-2">
          <button
            v-for="(feature, index) in features"
            :key="index"
            class="w-full text-left p-4 rounded-xl transition-all duration-200"
            :class="selectedFeature === index
              ? 'bg-stone-900 text-white'
              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'"
            @click="selectedFeature = index"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="selectedFeature === index ? 'bg-white/10' : 'bg-white'"
              >
                <Icon
                  :name="feature.icon"
                  class="w-5 h-5"
                  :class="selectedFeature === index ? 'text-white' : 'text-[#D11E28]'"
                />
              </div>
              <span class="font-medium">{{ feature.label }}</span>
            </div>
          </button>
        </div>

        <!-- Feature Content -->
        <div class="lg:col-span-8">
          <div class="bg-stone-50 rounded-2xl p-6 lg:p-8 border border-stone-100">
            <div class="mb-6">
              <h3 class="text-2xl font-semibold text-stone-900 mb-3">
                {{ features[selectedFeature].title }}
              </h3>
              <p class="text-stone-600 text-lg">
                {{ features[selectedFeature].description }}
              </p>
            </div>
            <div class="bg-white rounded-xl overflow-hidden border border-stone-200">
              <img
                :src="features[selectedFeature].image"
                :alt="features[selectedFeature].label"
                class="w-full h-auto"
              >
            </div>
            <NuxtLink
              :to="features[selectedFeature].link"
              class="inline-flex items-center text-[#D11E28] font-medium mt-6 hover:text-red-700 transition-colors"
            >
              Learn more about {{ features[selectedFeature].label }}
              <Icon name="lucide:arrow-right" class="w-5 h-5 ml-2" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
