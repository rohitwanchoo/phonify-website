<template>
  <div class="relative w-full bg-white px-4 lg:px-28 overflow-hidden">
    <div class="max-w-[1440px] mx-auto flex flex-col items-center gap-6 lg:gap-0 text-center relative z-10">
      <!-- Header Section -->
      <div class="flex flex-col gap-6 items-center ">
        <p class="text-stone-800 text-base font-light flex items-center gap-2">
          <span
            class="inline-block w-3 h-3 bg-[#D11E28] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]"
          />
          App Intro
        </p>

        <h1 class="text-stone-900 text-2xl lg:text-5xl font-medium leading-9">
          Phonify Mobile App
        </h1>

        <p class="text-stone-600 max-w-xl">
          Take your call center with you! Because work doesn’t have to stop when you leave your desk.
        </p>

        <div class="flex gap-5 mt-4">
          <img src="/assets/svg/public/footer/play-store.svg" alt="Google Play" class="h-10">
          <img src="/assets/svg/public/footer/app-store.svg" alt="App Store" class="h-10">
        </div>
      </div>

      <!-- App Mockup Section -->
      <div class="relative w-full flex flex-col items-center text-center h-auto">
        <!-- Mobile Cards Section (Flex Column Layout) -->
        <div class="relative flex flex-col gap-4 pb-8 items-center w-full lg:hidden">
          <img
            src="/images/website/sections/app-intro/mockup-holding.png" alt="Analytics Overview"
            class="w-[188px] h-[280px]"
          >
          <img src="/images/website/sections/app-intro/real-time.png" alt="Real-Time Monitoring" class="w-full object-cover">
          <img src="/images/website/sections/app-intro/smart-call.png" alt="Smart Call Handling" class="w-full object-cover">
          <img src="/images/website/sections/app-intro/role-based.png" alt="Role-Based Access" class="w-full object-cover">
        </div>

        <!-- Desktop Hand Mockup -->
        <div class="relative z-10 hidden lg:block">
          <img
            src="/images/website/sections/app-intro/hand.png" alt="Phone Mockup"
            class="h-[800px] lg:h-[900px] lg:-mt-60"
          >
        </div>
      </div>
    </div>
  </div>
</template>
