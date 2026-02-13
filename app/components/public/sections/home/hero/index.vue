<script setup>
import { Button } from '~/components/ui/button'
</script>

<template>
  <div class="w-full bg-gradient-to-b from-white to-stone-50">
    <!-- Announcement Bar -->
    <div class="w-full bg-stone-900 py-2.5 px-4">
      <div class="max-w-[1440px] mx-auto flex items-center justify-center gap-2">
        <span class="px-2 py-0.5 bg-red-600 text-white text-xs font-medium rounded">NEW</span>
        <p class="text-white text-sm">
          AI Voice Agents now handle inbound calls end-to-end
        </p>
        <NuxtLink to="/product" class="text-red-400 text-sm font-medium hover:text-red-300 flex items-center gap-1">
          Learn more
          <Icon name="lucide:arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <div class="max-w-[1440px] mx-auto w-full py-12 px-4 lg:pt-20 lg:pb-24">
      <!-- Hero Content -->
      <div class="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6 lg:space-y-8">
        <!-- Badge -->
        <div class="flex w-fit h-10 pl-1 pr-4 py-2 bg-stone-100 rounded-full border border-stone-200 items-center gap-2.5">
          <div class="px-3 py-1 bg-stone-900 rounded-full text-white text-xs font-medium">
            #1 Rated
          </div>
          <span class="text-stone-700 text-sm">AI-Powered VoIP Platform</span>
        </div>

        <!-- Headline -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold text-stone-900 leading-tight">
          AI Voice Agents That Handle<br class="hidden md:block" />
          <span class="text-[#D11E28]">Calls Like Your Best Rep</span>
        </h1>

        <!-- Subheadline -->
        <p class="text-lg md:text-xl text-stone-600 max-w-2xl leading-relaxed">
          Phonify automates inbound and outbound calls with AI that qualifies leads, books appointments, and resolves support tickets—24/7, at scale.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <NuxtLink to="/auth/signup">
            <Button class="h-12 px-8 bg-[#D11E28] hover:bg-[#b91c24] text-white rounded-lg font-medium text-base">
              Start Free Trial
              <Icon name="lucide:arrow-right" class="w-4 h-4 ml-2" />
            </Button>
          </NuxtLink>
          <NuxtLink to="https://bookings.easify.app/team/phonify/learn-all-about-phonify" target="_blank">
            <Button variant="outline" class="h-12 px-8 border-stone-300 text-stone-700 rounded-lg font-medium text-base hover:bg-stone-50">
              <Icon name="lucide:play-circle" class="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </NuxtLink>
        </div>

        <!-- Social Proof Bar -->
        <div class="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-stone-500">
          <div class="flex items-center gap-2">
            <Icon name="lucide:building-2" class="w-4 h-4" />
            <span>500+ Companies</span>
          </div>
          <div class="w-px h-4 bg-stone-300 hidden sm:block" />
          <div class="flex items-center gap-2">
            <Icon name="lucide:phone-call" class="w-4 h-4" />
            <span>2M+ Calls Monthly</span>
          </div>
          <div class="w-px h-4 bg-stone-300 hidden sm:block" />
          <div class="flex items-center gap-2">
            <Icon name="lucide:star" class="w-4 h-4 text-amber-500" />
            <span>4.8/5 Rating</span>
          </div>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="mt-12 lg:mt-16 relative">
        <div class="absolute inset-0 bg-gradient-to-t from-stone-50 to-transparent z-10 pointer-events-none h-20 bottom-0 top-auto" />
        <div class="w-full rounded-xl overflow-hidden shadow-2xl shadow-stone-200/50 border border-stone-200">
          <img
            src="/images/website/sections/home/hero-img.png"
            alt="Phonify Dashboard - AI Voice Platform"
            class="w-full h-auto object-cover"
          >
        </div>
      </div>

      <!-- Trust Logos -->
      <div class="mt-16 lg:mt-20">
        <p class="text-center text-sm text-stone-500 mb-8">Trusted by leading teams worldwide</p>
        <div class="flex flex-wrap items-center justify-center gap-8 lg:gap-12 opacity-60 grayscale">
          <div class="h-8 flex items-center text-stone-400 font-semibold text-lg">Company 1</div>
          <div class="h-8 flex items-center text-stone-400 font-semibold text-lg">Company 2</div>
          <div class="h-8 flex items-center text-stone-400 font-semibold text-lg">Company 3</div>
          <div class="h-8 flex items-center text-stone-400 font-semibold text-lg">Company 4</div>
          <div class="h-8 flex items-center text-stone-400 font-semibold text-lg">Company 5</div>
        </div>
      </div>
    </div>
  </div>
</template>
