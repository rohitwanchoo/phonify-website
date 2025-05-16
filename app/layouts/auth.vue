<template>
  <div class="flex items-center h-[100dvh] p-[20px] lg:gap-[50px] gap-[150px]">
    <div class="flex-1 flex flex-col gap-y-[72px] items-center justify-center">
      <img src="/images/logo/phonify-logo.png" alt="logo" class="max-w-[220px] w-full h-full max-h-[64px]">
      <div class="w-full max-w-[416px] lg:max-w-[380px] xl:max-w-[416px]">
        <slot />
      </div>
    </div>
    <div class="hidden lg:flex items-center w-full max-w-[500px] xl:max-w-[500px] 2xl:max-w-[800px] py-[60px] h-full bg-[#162D3A] pl-[60px] rounded-4xl">
      <div class="w-full ">
        <!-- ensure content doesn't overflow -->
        <h2 class="text-3xl text-white font-normal">
          Welcome 👋
        </h2>
        <p class="text-base text-white/80 mt-4">
          Today is a new day. It's your day. You shape it. <br>
          Login in to start managing your customer communications.
        </p>

        <div class="mt-12 overflow-hidden rounded-l-[32px] relative lg:h-[400px] xl:h-[475px] 2xl:h-[500px]">
          <img
            src="/images/dashboardone.png"
            alt="image"
            class="object-contain h-full w-full rounded-l-[32px]"
          >
          <div
            class="absolute top-0 right-0 h-full pointer-events-none"
            style="width: 100px; background: linear-gradient(to left, #162D3A80 15%, #162D3A29 60%, #FFFFFF00 100%)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
