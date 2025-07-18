<script setup lang="ts">
import { Icon } from '#components'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const logoUrl = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

async function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    try {
      // Create form data to send file
      const formData = new FormData()
      formData.append('logo', file)

      // Show preview immediately while uploading
      const reader = new FileReader()
      reader.onload = (e) => {
        logoUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)

      // Upload file to server
      // const response = await fetch('/api/upload-logo', {
      //   method: 'POST',
      //   body: formData
      // })
      const response = await useApi().post('/update-logo', formData)

      if (response.success) {
        showToast({ message: response.message })
      }

      // const data = await response.json()
      // // Update logo URL with the one from server if needed
      // // logoUrl.value = data.logoUrl
    }
    catch (error) {
      console.error('Error uploading logo:', error)
      showToast({ type: 'error', message: error?.message })
      // Handle error appropriately - show error message to user
      logoUrl.value = null
    }
  }
}
function triggerFileInput() {
  fileInputRef.value?.click()
}

function removeLogo() {
  logoUrl.value = null
  if (fileInputRef.value)
    fileInputRef.value.value = ''
}
</script>

<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="flex items-center justify-between mb-4 mt-3 pb-2">
      <h2 class="text-base font-normal">
        Demo Logo
      </h2>
    </div>
    <div class="border-b border-gray-200 mb-4 -mx-4" />
    <div
      class="relative w-full h-95 md:h-100 xl:h-95 flex items-start pt-6 justify-center overflow-hidden border border-gray-100 rounded-lg
      [background-image:url('/images/checkered-bg.png')] bg-contain bg-center"
    >
      <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="object-contain w-full  h-[100px] mt-auto mb-[33%]">

      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      >
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col xl:flex-row gap-2 z-1 w-[90%] ">
        <Button class="flex-1 bg-white text-black border border-black hover:bg-white hover:text-black" type="button" @click="triggerFileInput">
          <Icon name="material-symbols:upload" size="17" />
          Upload New
        </Button>
        <Button class="flex-1 bg-white border-black text-black hover:bg-white hover:text-black" type="button" variant="outline" @click="removeLogo">
          <Icon name="material-symbols:close" size="17" />
          Remove
        </Button>
      </div>
    </div>
  </div>
</template>
