<template>
    <div class="relative w-full bg-white px-4 md:px-28 py-8 md:py-24 overflow-hidden">

        <div
            class="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-white/100 via-white/80 to-transparent pointer-events-none z-20">
        </div>

        <div class="max-w-[1440px] mx-auto w-full flex flex-col items-center text-center relative z-10">

            <div class="text-center flex flex-col gap-6 items-center mb-16">
                <p class="text-stone-800 text-base font-light flex items-center gap-2">
                    <span
                        class="inline-block w-3 h-3 bg-[#D11E28] [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]" />
                    App Intro
                </p>

                <h1 class="text-stone-900 text-2xl md:text-5xl font-medium leading-9">
                    Phonify Mobile App
                </h1>

                <p class="text-stone-600 max-w-xl">
                    Take your call center with you! Because work doesn’t have to stop when you leave your desk.
                </p>

                <div class="flex gap-5 mt-4">
                    <img src="/assets/svg/public/footer/play-store.svg" alt="Google Play" class="h-10">
                    <img src="/assets/svg/public/footer/app-store.svg" alt="App Store" class="h-10">
                </div>
            </div>


            <div class="relative w-full flex flex-col justify-center items-center text-center mt-0 md:mt-10">

                <img src="/images/phonify-web/app-intro/ellipse.png" alt="Background Ellipse" class="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
         w-[160%] h-[160%] max-w-none object-cover opacity-90 blur-2xl brightness-120  z-0" />


                <div class="relative z-10 w-full lg:w-104">
                    <img src="/images/phonify-web/app-intro/iPhone-mockup-holding.png" alt="Phone Mockup"
                        class="w-full relative z-10">
                </div>
                <img src="/images/phonify-web/app-intro/real-time.png" alt="Real-Time Monitoring"
                    class="lg:absolute top-10 left-[3%] w-full lg:w-78 z-10" />

                <img src="/images/phonify-web/app-intro/smart-call.png" alt="Smart Call Handling"
                    class="lg:absolute bottom-15 left-[10%] w-full lg:w-78 z-20">
                <img src="/images/phonify-web/app-intro/role-based.png" alt="Role-Based Access"
                    class="lg:absolute top-1/3 right-[5%] w-full lg:w-78 z-20">
            </div>
        </div>
    </div>
</template>
