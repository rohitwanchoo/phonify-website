<script setup>
const testimonials = [
  {
    quote: 'We cut our cost per qualified lead by 60% in the first month. Phonify\'s AI handles our after-hours calls better than most humans.',
    author: 'Sarah Mitchell',
    role: 'Director of Sales',
    company: 'TechCorp Solutions',
    avatar: null,
  },
  {
    quote: 'Went from 500 to 2,000 daily calls without hiring a single new rep. The ROI was obvious within 2 weeks.',
    author: 'Marcus Johnson',
    role: 'Operations Manager',
    company: 'CallPro Services',
    avatar: null,
  },
  {
    quote: 'Finally, a platform that actually integrates with our stack. The Salesforce sync alone saved us 10 hours per week.',
    author: 'Emily Chen',
    role: 'RevOps Lead',
    company: 'GrowthBase Inc',
    avatar: null,
  },
]

const stats = [
  { value: '500+', label: 'Companies Trust Us' },
  { value: '2M+', label: 'Calls Per Month' },
  { value: '45%', label: 'Avg Cost Reduction' },
  { value: '99.9%', label: 'Uptime SLA' },
]

const currentTestimonial = ref(0)

function nextTestimonial() {
  currentTestimonial.value = (currentTestimonial.value + 1) % testimonials.length
}

function prevTestimonial() {
  currentTestimonial.value = (currentTestimonial.value - 1 + testimonials.length) % testimonials.length
}
</script>

<template>
  <section class="w-full bg-stone-50 py-16 lg:py-24 px-4">
    <div class="max-w-[1440px] mx-auto">
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
        <p class="text-[#D11E28] font-medium text-sm mb-4 flex items-center justify-center gap-2">
          <span class="w-8 h-px bg-[#D11E28]" />
          TRUSTED BY TEAMS
          <span class="w-8 h-px bg-[#D11E28]" />
        </p>
        <h2 class="text-3xl lg:text-4xl font-semibold text-stone-900">
          Teams who can't afford dropped calls choose Phonify
        </h2>
      </div>

      <!-- Stats Bar -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-12 lg:mb-16">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-white rounded-xl p-6 text-center border border-stone-100"
        >
          <div class="text-3xl lg:text-4xl font-bold text-stone-900 mb-1">
            {{ stat.value }}
          </div>
          <div class="text-sm text-stone-500">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!-- Testimonials -->
      <div class="bg-white rounded-2xl p-8 lg:p-12 border border-stone-100 mb-12">
        <div class="flex items-center justify-between mb-8">
          <Icon name="lucide:quote" class="w-12 h-12 text-stone-200" />
          <div class="flex gap-2">
            <button
              class="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
              @click="prevTestimonial"
            >
              <Icon name="lucide:chevron-left" class="w-5 h-5 text-stone-600" />
            </button>
            <button
              class="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
              @click="nextTestimonial"
            >
              <Icon name="lucide:chevron-right" class="w-5 h-5 text-stone-600" />
            </button>
          </div>
        </div>

        <div class="max-w-3xl">
          <p class="text-xl lg:text-2xl text-stone-700 leading-relaxed mb-8">
            "{{ testimonials[currentTestimonial].quote }}"
          </p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
              <Icon name="lucide:user" class="w-6 h-6 text-stone-500" />
            </div>
            <div>
              <p class="font-semibold text-stone-900">
                {{ testimonials[currentTestimonial].author }}
              </p>
              <p class="text-sm text-stone-500">
                {{ testimonials[currentTestimonial].role }}, {{ testimonials[currentTestimonial].company }}
              </p>
            </div>
          </div>
        </div>

        <!-- Dots indicator -->
        <div class="flex justify-center gap-2 mt-8">
          <button
            v-for="(_, index) in testimonials"
            :key="index"
            class="w-2 h-2 rounded-full transition-colors"
            :class="index === currentTestimonial ? 'bg-[#D11E28]' : 'bg-stone-300'"
            @click="currentTestimonial = index"
          />
        </div>
      </div>

      <!-- Trust Badges -->
      <div class="flex flex-wrap items-center justify-center gap-6 lg:gap-12">
        <div class="flex items-center gap-2 text-stone-600">
          <Icon name="lucide:shield-check" class="w-6 h-6 text-green-600" />
          <span class="text-sm font-medium">SOC 2 Type II</span>
        </div>
        <div class="flex items-center gap-2 text-stone-600">
          <Icon name="lucide:lock" class="w-6 h-6 text-blue-600" />
          <span class="text-sm font-medium">HIPAA Compliant</span>
        </div>
        <div class="flex items-center gap-2 text-stone-600">
          <Icon name="lucide:file-check" class="w-6 h-6 text-purple-600" />
          <span class="text-sm font-medium">TCPA Built-In</span>
        </div>
        <div class="flex items-center gap-2 text-stone-600">
          <Icon name="lucide:globe" class="w-6 h-6 text-orange-600" />
          <span class="text-sm font-medium">GDPR Ready</span>
        </div>
      </div>
    </div>
  </section>
</template>
