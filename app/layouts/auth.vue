<template>
  <div class="grid grid-cols-12 h-[100dvh] p-[20px] gap-y-[150px] lg:gap-x-[50px] items-center ">
    <div class="col-span-12 lg:col-span-6  flex flex-col gap-y-[72px] items-center justify-center">
      <img src="/images/logo/phonify-logo.png" alt="logo" class="max-w-[220px] w-full h-full max-h-[64px]">
      <div class="w-full max-w-[416px] lg:max-w-[380px] xl:max-w-[416px]">
        <slot />
      </div>
    </div>

    <div class="hidden lg:flex lg:col-span-6 items-center w-full max-w-full xl:max-w-[1000px] 2xl:max-w-[1200px] py-[60px] h-full bg-[#162D3A] pl-[60px] rounded-4xl overflow-hidden">
      <div class="w-full relative">
        <h2 class="text-4xl text-white font-normal">
          Welcome 👋
        </h2>
        <p class="text-base text-white/80 mt-4">
          Today is a new day. It's your day. You shape it. <br>
          Login in to start managing your customer communications.
        </p>

        <div class="mt-12 overflow-hidden h-full lg:h-[400px] xl:h-[450px] 2xl:h-full  relative">
          <img
            src="/images/dashboardone.png"
            alt="image"
            class="object-cover 2xl:object-contain object-left h-full lg:h-[400px] xl:h-[450px] 2xl:h-full  w-full"
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
