<script setup>
import { Button } from '~/components/ui/button'
</script>

<template>
  <section class="w-full bg-gradient-to-br from-stone-900 via-stone-900 to-stone-800 py-16 lg:py-24 px-4">
    <div class="max-w-[1440px] mx-auto">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Heading -->
        <h2 class="text-3xl lg:text-5xl font-semibold text-white mb-6">
          Ready to stop missing calls?
        </h2>
        <p class="text-lg lg:text-xl text-stone-400 mb-10 max-w-2xl mx-auto">
          Start a free trial or book a call with our team. No credit card required. Cancel anytime.
        </p>

        <!-- Two CTA Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-10">
          <!-- Trial Card -->
          <div class="bg-white rounded-2xl p-6 lg:p-8 text-left">
            <div class="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mb-4">
              <Icon name="lucide:zap" class="w-6 h-6 text-[#D11E28]" />
            </div>
            <h3 class="text-xl font-semibold text-stone-900 mb-2">
              Start Free Trial
            </h3>
            <p class="text-stone-600 mb-6">
              Get 200 credits free. Set up in under 5 minutes. Full platform access.
            </p>
            <NuxtLink to="/auth/signup" class="block">
              <Button class="w-full h-12 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium">
                Start Trial
                <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
              </Button>
            </NuxtLink>
          </div>

          <!-- Demo Card -->
          <div class="bg-stone-800 rounded-2xl p-6 lg:p-8 text-left border border-stone-700">
            <div class="w-12 h-12 bg-stone-700 rounded-xl flex items-center justify-center mb-4">
              <Icon name="lucide:users" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">
              Talk to Sales
            </h3>
            <p class="text-stone-400 mb-6">
              Custom pricing for high-volume teams. Live demo of your use case.
            </p>
            <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank" class="block">
              <Button variant="outline" class="w-full h-12 border-stone-600 text-white hover:bg-stone-700 rounded-lg font-medium">
                Book Demo
                <Icon name="lucide:calendar" class="w-4 h-4 ml-2" />
              </Button>
            </NuxtLink>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
          <a href="tel:+1800PHONIFY" class="flex items-center gap-2 hover:text-stone-300 transition-colors">
            <Icon name="lucide:phone" class="w-4 h-4" />
            1-800-PHONIFY
          </a>
          <span class="text-stone-700">|</span>
          <a href="mailto:sales@phonify.app" class="flex items-center gap-2 hover:text-stone-300 transition-colors">
            <Icon name="lucide:mail" class="w-4 h-4" />
            sales@phonify.app
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
