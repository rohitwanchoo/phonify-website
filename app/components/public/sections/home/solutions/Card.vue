<script setup>
import { sanitizeHtml } from '~/utils'

defineProps({
    title: String,
    image: String,
    description: String,
});
</script>

<template>
    <div class="bg-white flex flex-col  gap-4 border border-[#E7E5E4]  p-4 ">
        <h1 class="text-base sm:text-xl  font-medium">{{ title }}</h1>
        <img :src="image" :alt="title" class="w-full md:w-[100%] h-auto object-contain " />
        <p class="font-normal text-sm sm:text-base leading-relaxed" v-html="sanitizeHtml(description)"></p>
    </div>
</template>

