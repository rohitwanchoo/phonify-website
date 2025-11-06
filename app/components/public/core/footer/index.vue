<script setup lang="ts">
import appStore from '~/assets/svg/public/footer/app-store.svg'
import email from '~/assets/svg/public/footer/email.svg'
import fb from '~/assets/svg/public/footer/fb.svg'
import instagram from '~/assets/svg/public/footer/instagram.svg'
import linkedin from '~/assets/svg/public/footer/linkedin.svg'
import location from '~/assets/svg/public/footer/location.svg'
import phone from '~/assets/svg/public/footer/phone.svg'
import playStore from '~/assets/svg/public/footer/play-store.svg'
import twitter from '~/assets/svg/public/footer/twitter-x.svg'
import logo from '~/assets/svg/public/phonify.svg'

const social = [
  {
    link: '#',
    icon: fb,
  },
  {
    link: '#',
    icon: twitter,
  },
  {
    link: '#',
    icon: instagram,
  },
  {
    link: '#',
    icon: linkedin,
  },
]

const company = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Features',
    link: '/features',
  },
  {
    name: 'Pricing',
    link: '/pricing',
  },
  {
    name: 'Blogs',
    link: '/blogs',
  },
  {
    name: 'Contact us',
    link: '/contact-us',
  },
]

const address = [
  {
    value: '+1 (341) 882-7279',
    icon: phone,
  },
  {
    value: 'Phonify@gmail.com',
    icon: email,
  },
  {
    value: '75467 Poplar Avenue, Spring Hill 62595',
    icon: location,
  },
]
</script>

<template>
  <PublicCoreFooterMakeCall />
  <div class="w-full bg-gradient-to-b from-white/0 to-white">
    <footer class="max-w-[1440px] mx-auto w-full pt-8 md:pt-[100px] px-4">
      <div class="w-full pt-6 md:pt-20 bg-white rounded-3xl shadow-[0px_30px_50px_0px_rgba(0,0,0,0.05)] outline outline-offset-[-1px] outline-stone-200 flex flex-col justify-start items-center gap-6 md:gap-20 overflow-hidden">
        <div class="w-full px-4 md:px-20 flex flex-col md:flex-row justify-start items-center gap-6 md:gap-20">
          <div class="max-w-[420px] w-full flex flex-col justify-start items-start gap-6">
            <img :src="logo" alt="phonify logo">
            <p class="justify-start text-stone-700 leading-6">
              Smarter calls. Faster growth. Phonify’s AI phone system scales productivity and efficiency like never before.
            </p>
            <ul class="flex gap-6 items-center mt-2">
              <li v-for="item in social" :key="item.link">
                <NuxtLink :to="item.link">
                  <img :src="item.icon" alt="facebook logo">
                </NuxtLink>
              </li>
            </ul>
          </div>
          <div class="w-full flex flex-col md:flex-row justify-between items-start gap-6 md:gap-20">
            <div class="flex flex-col justify-center items-start gap-4">
              <div class="justify-start text-black font-medium leading-6">
                Company
              </div>
              <div class="flex flex-col justify-start items-start gap-3">
                <NuxtLink v-for="item in company" :key="item.link" :to="item.link" class="justify-start text-stone-900 font-light leading-6 text-nowrap hover:text-black hover:underline">
                  {{ item.name }}
                </NuxtLink>
              </div>
            </div>
            <div class="flex flex-col justify-start items-start gap-4">
              <div class="justify-start text-black font-medium leading-6">
                Address
              </div>
              <div class="h-full flex flex-col justify-between items-start gap-3">
                <div v-for="item in address" :key="item.value" class="flex justify-center items-start gap-2.5">
                  <div class="w-6 h-6 flex justify-center items-center bg-stone-200 rounded-full">
                    <img :src="item.icon" alt="phone logo" class="w-3.5 h-3.5">
                  </div>
                  <div class="justify-start text-stone-900 font-light leading-6">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>
            <div class="w-full md:w-fit px-3 py-4 md:py-6 md:px-6 bg-stone-100 rounded-lg outline outline-offset-[-1px] outline-stone-200 flex flex-col justify-center items-center gap-3 md:gap-4">
              <div class="justify-start text-black font-medium leading-6">
                Download App
              </div>
              <div class="flex flex-row md:flex-col justify-center items-center gap-3 md:gap-4">
                <NuxtLink to="#">
                  <img :src="playStore" alt="download app">
                </NuxtLink>
                <NuxtLink to="#">
                  <img :src="appStore" alt="download app">
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full px-4 md:px-14 py-5 md:py-8 border-t border-gray-800/5 text-center text-zinc-800 text-xs md font-extralight leading-6">
          © 2025 Phonify. All rights reserved
        </div>
      </div>
    </footer>
    <div class="mt-6 md:mt-12">
      <div class="max-w-[1440px] mx-auto w-full px-4 relative">
        <img src="/images/website/footer/phonify-name.png" alt="phonify logo">
        <div class="h-full w-full bg-gradient-to-b from-white/0 to-white absolute bottom-0 left-0" />
      </div>
    </div>
  </div>
</template>
