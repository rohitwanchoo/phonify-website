<template>
  <div class="w-full layout-montserrat">
    <PublicCoreNavbar class="sticky top-0 z-50" />
    <slot />
    <PublicCoreFooter />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.layout-montserrat {
  font-family: "Montserrat", sans-serif !important;
}
</style>
