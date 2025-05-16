<script setup>
definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="mb-[25px]">
    <!-- <div class="mb-[16px]">
      <label class="text-sm text-[#0C1421]" for="username">Phone Number</label>
      <input type="text" class="w-full h-[52px] border border-[#E0E8E7] p-[16px] rounded-[8px] bg-[#F8F8F8]" placeholder="(---)-------">
    </div> -->
    <div class="mb-[16px]">
      <label class="text-sm text-[#0C1421]" for="username">Phone Number</label>
      <input
        v-maska
        type="text"
        data-maska="(###) ###-####"
        class="w-full h-[52px] border border-[#E0E8E7] p-[16px] rounded-[8px] bg-[#F8F8F8]"
        placeholder="(---) -------"
      >
    </div>
    <div>
      <label class="text-sm text-[#0C1421]" for="password">Password</label>
      <input type="text" class="w-full h-[52px] border border-[#E0E8E7] p-[16px] rounded-[8px] bg-[#F8F8F8]" placeholder="Enter Password...">
    </div>
  </div>

  <div>
    <Button class="bg-[#162D3A] text-white font-normal text-base w-full h-[52px] rounded-[12px]">
      <NuxtLink to="/app/dashboard" class="w-full h-full flex items-center justify-center">
        Sign up
      </NuxtLink>
    </Button>
  </div>
  <div class="text-sm mt-[40px] flex justify-center">
    <span class="text-[#313957]">
      Already have an account?
    </span>
    <NuxtLink to="/auth/login" class="underline text-[#162D3A] font-semibold">
      Sign in
    </NuxtLink>
  </div>
</template>
