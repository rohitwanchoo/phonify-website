<script setup>
import logo from '~/assets/svg/public/phonify.svg'
</script>

<template>
  <nav class="w-full px-4 py-6 lg:py-8 bg-white border-b border-gray-100">
    <div class="max-w-[1440px] mx-auto w-full flex justify-between items-center">
      <div class="hidden lg:flex items-center w-full gap-[54px]">
        <img :src="logo" alt="phonify logo">
        <PublicCoreNavbarItems />
      </div>
      <div class="w-full flex items-center justify-between lg:hidden">
        <img :src="logo" alt="phonify logo">
        <PublicCoreNavbarMobile />
      </div>
    </div>
  </nav>
</template>
