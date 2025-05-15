<template>
  <div class="flex items-center h-full">
    <div class="flex-1 flex flex-col gap-y-[72px] items-center justify-center">
      <img src="/images/logo/phonify-logo.png" alt="logo" class="max-w-[220px] w-full h-full max-h-[64px]">
      <div>
        <div>
          <div></div>
          <Button class="bg-[#162D3A] text-white font-semibold text-base w-full h-[52px] rounded-[8px]">
            <NuxtLink to="/app/dashboard" class="w-full h-full flex items-center justify-center">
              Sign in
            </NuxtLink>
          </Button>
        </div>
        <div class="text-sm mt-10">
          <span class="text-[#313957]">
            Already have an account?
          </span>
          <NuxtLink to="/auth/signup" class="underline text-[#162D3A] font-semibold">
            Sign up
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="flex-1 bg-[#162D3A] h-full pl-[60px] py-[100px] rounded-4xl">
      <div>
        <h2 class="text-3xl text-white font-semibold">
          Welcome 👋
        </h2>
        <p class="text-base text-white/80 mt-4">
          Today is a new day. It's your day. You shape it. <br>
          Login in to start managing your customer communications.
        </p>
        <div class="mt-12 overflow-hidden max-h-[60vh] rounded-l-2xl">
          <img src="/images/dashboard.png" alt="image" class="object-cover w-full h-full">
        </div>
      </div>
    </div>
  </div>
</template>
