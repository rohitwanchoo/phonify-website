<script setup>
import AboutUsCard from './Card.vue'
</script>

<template>
    <section class="bg-white overflow-x-hidden ">
        <div class="max-w-[1440px] mx-auto flex flex-col gap-6 md:gap-16 p-6">
            <!-- Heading Section -->
            <div class="flex flex-col gap-4 md:gap-5 text-start">
                <h1 class="font-light text-base">
                    <span
                        class="inline-block w-3 h-3 bg-[#D11E28] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />
                    About us
                </h1>

                <div class="flex flex-col lg:flex-row gap-6  lg:gap-24">
                    <h2 class="font-medium text-2xl sm:text-4xl md:text-5xl leading-tight">
                        Built for teams who <br class="hidden lg:block">
                        spend their day on calls
                    </h2>
                    <p class="font-extralight text-base sm:text-lg md:text-xl">
                        We wanted a better way for teams to manage calls, track <br class="hidden lg:block">
                        progress, and stay in sync. A single platform for every <br class="hidden lg:block">
                        kind of call – inbound or outbound, support or sales. <br class="hidden lg:block">
                        <span class="font-medium">So, we built one!</span>
                    </p>
                </div>
            </div>

            <!-- Cards Section -->
            <div
                class="flex flex-col sm:flex-row sm:flex-wrap md:flex-nowrap justify-center md:justify-start items-center md:items-stretch gap-6">
                <AboutUsCard icon="material-symbols:bolt" value="43%" description="faster follow- <br/>ups" />
                <AboutUsCard icon="material-symbols:phone-in-talk" value="60%"
                    description="more completed <br /> calls" />
                <AboutUsCard icon="mdi:account-check" value="2.5x" description="higher lead <br /> conversions" />
               <AboutUsCard 
  icon="mdi:sparkles" 
  value="45%" 
  description="of calls handled <br /> by AI" 
/>
            </div>
        </div>
    </section>
</template>
