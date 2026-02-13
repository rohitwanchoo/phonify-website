<script setup>
const problems = [
  {
    icon: 'lucide:phone-missed',
    title: 'Missed Calls = Missed Revenue',
    description: '80% of callers who reach voicemail won\'t call back. You\'re losing deals every hour your team can\'t pick up.',
    stat: '80%',
    statLabel: 'won\'t call back',
  },
  {
    icon: 'lucide:users',
    title: 'Scaling Means Hiring',
    description: 'Every 20% growth in call volume requires another rep. At $50K+ per hire, scaling becomes unsustainable.',
    stat: '$50K+',
    statLabel: 'per new hire',
  },
  {
    icon: 'lucide:clipboard-x',
    title: 'Manual Follow-Ups Get Dropped',
    description: 'Your reps make 50 calls but log 20. Without automation, leads slip through the cracks.',
    stat: '60%',
    statLabel: 'calls unlogged',
  },
]
</script>

<template>
  <section class="w-full bg-white py-16 lg:py-24 px-4">
    <div class="max-w-[1440px] mx-auto">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
        <p class="text-[#D11E28] font-medium text-sm mb-4 flex items-center justify-center gap-2">
          <span class="w-8 h-px bg-[#D11E28]" />
          THE PROBLEM
          <span class="w-8 h-px bg-[#D11E28]" />
        </p>
        <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900 mb-4">
          Your team is drowning in calls. AI can fix that.
        </h2>
        <p class="text-lg text-stone-600">
          Traditional call centers face the same challenges. Phonify was built to solve them.
        </p>
      </div>

      <!-- Problem Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
        <div
          v-for="(problem, index) in problems"
          :key="index"
          class="bg-stone-50 rounded-xl p-6 lg:p-8 border border-stone-100 hover:border-stone-200 transition-colors"
        >
          <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-4">
            <Icon :name="problem.icon" class="w-6 h-6 text-[#D11E28]" />
          </div>
          <h3 class="text-xl font-semibold text-stone-900 mb-3">
            {{ problem.title }}
          </h3>
          <p class="text-stone-600 mb-4">
            {{ problem.description }}
          </p>
          <div class="pt-4 border-t border-stone-200">
            <span class="text-2xl font-bold text-[#D11E28]">{{ problem.stat }}</span>
            <span class="text-stone-500 text-sm ml-2">{{ problem.statLabel }}</span>
          </div>
        </div>
      </div>

      <!-- Solution Statement -->
      <div class="bg-gradient-to-r from-stone-900 to-stone-800 rounded-2xl p-8 lg:p-12 text-center">
        <div class="max-w-3xl mx-auto">
          <div class="w-16 h-16 bg-[#D11E28] rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="lucide:sparkles" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-2xl lg:text-3xl font-semibold text-white mb-4">
            The Solution: AI That Actually Handles Calls
          </h3>
          <p class="text-lg text-stone-300 mb-8">
            Phonify deploys AI voice agents that answer every call, qualify every lead, and automate every follow-up—so your team focuses on closing, not dialing.
          </p>
          <NuxtLink to="/product" class="inline-flex items-center text-[#D11E28] font-medium hover:text-red-400 transition-colors">
            See How It Works
            <Icon name="lucide:arrow-right" class="w-5 h-5 ml-2" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
