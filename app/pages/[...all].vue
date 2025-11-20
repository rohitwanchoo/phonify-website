<script setup lang="ts">
import { Button } from '~/components/ui/button'

const router = useRouter()
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div class="flex flex-col gap-4 items-center justify-center h-[50vh]">
    <Icon name="material-symbols:warning" class="inline-block text-green-950" size="90" />
    <h1 class="text-3xl font-bold text-center">
      Page Not Found
    </h1>
    <Button variant="outline" @click="router.back()">
      <Icon class="!text-green-900 text-lg" name="material-symbols:arrow-back" />
      Go back
    </Button>
  </div>
</template>
