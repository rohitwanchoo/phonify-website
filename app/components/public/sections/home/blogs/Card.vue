<script setup>
defineProps({
  title: String,
  image: String,
  description: String,
  date: String,
  author: String,
})
</script>

<template>
  <div
    class="bg-white flex flex-col gap-4 border border-[#E7E5E4] p-4 relative overflow-hidden group cursor-pointer transition-all duration-500 "
    @touchstart.stop=""
  >
    <div class="relative w-full overflow-hidden ">
      <img
        :src="image" :alt="title"
        class="w-full h-auto object-cover transition-all duration-700 ease-out group-hover:blur-[1.5px] group-hover:scale-105"
      >


      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent " />

   
      <div
        class="absolute bottom-0 left-0 w-full flex justify-between items-end p-4 text-white text-xs sm:text-sm font-normal"
      >
        <p>Marketing</p>
        <p>12 Mins Read</p>
      </div>

      <div
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
      >
        <button
          class="bg-[#D11E28] text-white font-medium px-5 py-2  shadow-md transform translate-y-10 group-hover:translate-y-0 transition-all duration-500"
        >
          Read More
        </button>
      </div>
    </div>

    <h1 class="text-lg font-semibold text-gray-900">
      {{ title }}
    </h1>

    <p
      class="font-normal text-sm leading-relaxed text-gray-600 border-b border-dashed border-[#E7E5E4] pb-4"
      v-html="description"
    />

 
    <p class="text-sm text-gray-500 mt-2 flex items-center gap-2">
      <span>{{ date }}</span>
      <span class="inline-block w-2 h-2 bg-[#000000] [clip-path:polygon(0%_0%,100%_0%,100%_100%,0%_100%)]" />
      <span class="font-semibold text-gray-900 underline">by {{ author }}</span>
    </p>
  </div>
</template>
