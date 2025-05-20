<script setup>
definePageMeta({
  layout: 'auth',
})
</script>

<template>
  <div class="mb-[25px]">
    <div class="mb-[16px]">
      <label class="text-sm text-[#0C1421]" for="username">Username</label>
      <input type="text" class="w-full h-[52px] border border-[#E0E8E7] p-[16px] rounded-[8px] bg-[#F8F8F8]" placeholder="Enter user name...">
    </div>
    <div>
      <label class="text-sm text-[#0C1421]" for="password">Password</label>
      <input type="text" class="w-full h-[52px] border border-[#E0E8E7] p-[16px] rounded-[8px] bg-[#F8F8F8]" placeholder="Enter Password...">
      <div class="flex justify-end mt-4">
        <label class="text-sm text-[#0C1421] cursor-pointer" for="forget-password">
          Forget Password?
        </label>
      </div>
    </div>
  </div>

  <div>
    <Button class="bg-[#162D3A] text-white font-normal text-base w-full h-[52px] rounded-[12px]">
      <NuxtLink to="/app/dashboard" class="w-full h-full flex items-center justify-center">
        Sign in
      </NuxtLink>
    </Button>
  </div>
  <div class="text-sm mt-[40px] flex justify-center">
    <span class="text-[#313957]">
      Don't have an account?<span />
    </span>
    <NuxtLink to="/auth/signup" class="underline text-[#162D3A] font-semibold pl-[5px]">
      Sign up
    </NuxtLink>
  </div>
</template>
