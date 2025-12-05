<script setup lang="ts">
import logo from '~/assets/svg/public/phonify.svg'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '~/components/ui/sheet'
</script>

<template>
  <Sheet class="w-full">
    <SheetTrigger as-child>
      <Icon name="material-symbols:menu" size="32" />
    </SheetTrigger>
    <SheetContent side="top" class="!gap-0">
      <SheetHeader class="px-4 py-6 flex flex-row justify-between items-center">
        <img :src="logo" alt="phonify logo">
        <SheetClose as-child>
          <Icon name="material-symbols:close" size="32" class="text-black cursor-pointer" />
        </SheetClose>
      </SheetHeader>
      <PublicCoreNavbarItems />
    </SheetContent>
  </Sheet>
</template>
