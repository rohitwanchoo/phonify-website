<script setup lang="ts">
interface User {
  id: number
  email: string
  name: string
  first_name: string
  last_name: string
  mobile: string
  companyName: string
  extension: number
  joined: string
  address: string
  alt_extension: string
  app_extension: string
}

const props = defineProps<{
  user: User
}>()

const userDetails = computed(() => [
  { label: 'Full Name', value: `${props.user.first_name} ${props.user.last_name}` },
  { label: 'User ID', value: props.user.id },
  { label: 'Joined', value: props.user.joined },
  { label: 'Email', value: props.user.email },
  { label: 'Phone Number', value: props.user.mobile },
  { label: 'Address', value: props.user.address },
  // { label: 'Company', value: props.user.companyName },
  { label: 'Extension', value: props.user.extension },
  // { label: 'Alt Extension', value: props.user.alt_extension },
  // { label: 'App Extension', value: props.user.app_extension },
])
</script>

<template>
  <div>
    <img src="/images/profile/profile-placeholder.png" class="w-full">
    <div class="relative">
      <div class="rounded-full absolute -top-17 left-7 lg:-top-17 lg:left-7 md:size-10 md:-top-7 size-15 lg:size-16 text-lg font-semibold bg-[#00A086] flex justify-center items-center text-white">
        JD
      </div>
      <div name="details_container" class="flex flex-col p-5 gap-5 w-full overflow-y-auto">
        <div v-for="(detail, index) in userDetails" :key="index">
          <p class="text-sm text-gray-600 pb-1 whitespace-normal text-wrap">
            {{ detail.label }}
          </p>
          <p class="text-sm text-primary font-medium whitespace-normal text-wrap">
            {{ detail.value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
