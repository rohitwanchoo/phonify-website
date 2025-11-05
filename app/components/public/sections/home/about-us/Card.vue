<script setup>
defineProps({
    icon: String,
    value: String,
    description: String,
});
</script>

<template>
    <div class="relative group flex flex-row sm:flex-col justify-between border border-[#F2F3F0] bg-[#FDFDFD] rounded-[2px]
           w-full max-w-[361px] min-h-[94px] md:w-[300px] md:h-[350px]
           px-4 py-5 md:p-8 md:pl-4
           gap-[19px] md:gap-32
           mx-auto box-border overflow-hidden cursor-pointer transition-all duration-500 ease-in-out">
        <div
            class="absolute inset-0 bg-black origin-top-left scale-0 group-hover:scale-100 transition-transform duration-500 ease-in-out z-0">
        </div>

        <div
            class="relative z-10 flex items-center justify-center bg-[#F5F5F4] w-10 h-10 sm:w-12 sm:h-12 rounded-[2px] border border-[#0000001A] transition-all duration-300 group-hover:bg-white">
            <img :src="icon" alt="Icon" class="w-6 h-6 sm:w-8 sm:h-8 object-contain transition-all duration-300
         group-hover:invert-[18%] group-hover:sepia group-hover:saturate-[7400%]
         group-hover:hue-rotate-[357deg] group-hover:brightness-[99%] group-hover:contrast-[112%]" />


        </div>
        <div
            class="relative z-10 flex flex-col md:gap-2 justify-center sm:justify-between sm:items-start flex-1 overflow-hidden transition-colors duration-500">
            <h3
                class="text-2xl sm:text-3xl md:text-5xl font-semibold text-[#D11E28] transition-colors duration-500 group-hover:text-white">
                {{ value }}
            </h3>
            <p class="italic font-normal text-sm sm:text-xl text-[#44403C] leading-tight break-words transition-colors duration-500 group-hover:text-white"
                v-html="description">
            </p>
        </div>
    </div>
</template>
<style>
.icon {
    width: 32px;
    height: 32px;
    fill: none;
    stroke: #1f1e1c;
    /* visible default color */
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.3s ease;
}

.icon:hover {
    stroke: red;
    /* hover color */
}
</style>
