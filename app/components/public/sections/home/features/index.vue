<script setup>
const options = [
  {
    label: 'All-in-one dashboard',
    title: 'See everything at a glance',
    content: 'All from a single place: a unified dashboard for everything that matters. Run campaigns, make calls, send SMS or emails, automate voice messages, and more.',
    image: '/images/website/sections/home/feature1.png',
    duration: 5000,
  },
  {
    label: 'AI + Automation features',
    title: 'Intelligence built into every step',
    content: 'Automatically track call outcomes, analyze performance metrics, receive real-time alerts, and let AI handle every call from start to finish. Bonus: a built-in calendar!',
    image: '/images/website/sections/home/feature2.png',
    duration: 5000,
  },
  {
    label: 'Omnichannel hub',
    title: 'All your communication, together',
    content: 'Calls, SMS, Emails, and Ringless voicemail live in one place. Each tool is powerful on its own, but together they give your team a seamless, unified workflow.',
    image: '/images/website/sections/home/feature3-1.png',
    duration: 5000,
  },
  {
    label: 'Reminders & real-time insights',
    title: 'All your communication, together',
    content: 'Calls, SMS, Emails, and Ringless voicemail live in one place. Each tool is powerful on its own, but together they give your team a seamless, unified workflow.',
    image: '/images/website/sections/home/feature4.png',
    duration: 5000,
  },
  {
    label: 'Security made effortless',
    title: 'Stay protected. Stay in charge',
    content: 'User roles, IP limits, and activity logs — all managed with ease. Simple, solid security and full visibility.',
    image: '/images/website/sections/home/feature5.png',
    duration: 5000,
  },
]

const observableElement = ref(null)

let observer

onMounted(() => {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting)
        observableElement.value.play()

      else
        observableElement.value.pause()
    })
  }, options)

  if (observableElement.value)
    observer.observe(observableElement.value)
})

const selectedItem = ref(0)
const timer = ref(null)

const totalItems = options.length
const progressBarWidth = ref(0)
const videoElement = ref(null)

function moveToNextItem() {
  selectedItem.value = (selectedItem.value + 1) % totalItems
}

function startTimer() {
  clearInterval(timer.value)
  progressBarWidth.value = 0

  const startTime = Date.now()
  const duration = options[selectedItem.value].duration // use per-option duration

  timer.value = setInterval(() => {
    const elapsedTime = Date.now() - startTime
    const progress = Math.min(elapsedTime / duration, 1) * 100

    progressBarWidth.value = progress

    if (progress >= 100) {
      clearInterval(timer.value)
      // Wait for 1 second after progress bar completes before switching
      setTimeout(() => {
        moveToNextItem()
        progressBarWidth.value = 0
        startTimer()
      }, 500)
    }
  }, 16.67)
}

watch(selectedItem, (_newVal) => {
  startTimer()
  if (videoElement.value) {
    videoElement.value.load()
    videoElement.value.play()
  }
})

onMounted(startTimer)

onBeforeUnmount(() => {
  observer?.disconnect()
  clearInterval(timer.value)
})
</script>

<template>
  <div id="features" class="w-full bg-white px-4 md:px-28 py-8 md:py-24">
    <div class="max-w-[1440px] mx-auto w-full space-y-6 md:space-y-16">
      <div class="space-y-4 md:space-y-5">
        <p class="text-stone-800 text-base font-light">
          <span class="inline-block w-3 h-3 bg-[#D11E28] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />
          Features
        </p>
        <h1 class="text-stone-900 text-2xl md:text-5xl font-medium leading-9">
          Your complete call center solution
        </h1>
      </div>
      <div class="flex items-start justify-between md:items-center flex-col md:flex-row gap-6 md:gap-[100px]">
        <div class="w-full md:max-w-96 flex flex-row md:flex-col gap-4 md:gap-0 overflow-x-auto">
          <div
            v-for="(item, index) in options"
            :key="index"
            class="relative cursor-pointer pb-4 md:pb-8 hover:bg-accent/50 h-fit border-b border-stone-300 border-dotted"
            :class="index === 0 ? 'pt-0' : 'pt-0 md:pt-8'"
            @click="selectedItem = index"
          >
            <div class="text-stone-500 text-base md:text-xl font-normal text-nowrap">
              {{ item.label }}
            </div>

            <div
              v-if="selectedItem === index"
              data-aos-duration="500"
            >
              <div class="w-full absolute left-0 -bottom-[1px]">
                <div class="w-full h-[2px]">
                  <div
                    class="h-full bg-[#D11E28] transition-transform  ease-in-out transform origin-left"
                    :style="{ transform: `scaleX(${progressBarWidth / 100})` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="max-w-[745px] h-fit w-full py-4 md:py-8 bg-[#F8F3F0] rounded-sm outline outline-offset-[-1px] outline-stone-100 flex flex-col justify-start items-start">
          <div class="w-full pt-1.5 md:pt-3 px-3 md:px-6 space-y-5 md:space-y-10">
            <h2 class="text-base md:text-3xl font-medium text-zinc-900">
              {{ options[selectedItem].title }}
            </h2>
            <div class="w-full md:h-96">
              <img :src="options[selectedItem].image" alt="" class="w-full h-full object-contain">
            </div>
          </div>
          <p class="text-stone-700 text-sm md:text-base leading-6 p-3 md:p-6">
            {{ options[selectedItem].content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
