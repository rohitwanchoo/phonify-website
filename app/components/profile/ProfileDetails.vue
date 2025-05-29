<script setup>
const userDetails = [
  { label: 'Full Name', value: 'John Doe' },
  { label: 'User ID', value: 'john_doe_123' },
  { label: 'Joined', value: '01/05/2025 12:00 PM' },
  { label: 'Email', value: 'johndoe@gmail.com' },
  { label: 'Phone Number', value: '+1 (837) 127 9182' },
  { label: 'Address', value: '829 Cindy Stravenue, West Betsyboro' },
  { label: 'Extention', value: '09234' },
]
</script>

<template>
  <div>
    <img src="/images/profile/profile-placeholder.png" class="w-full">
    <div class="relative">
      <div class="rounded-full absolute -top-14 left-7 size-15 text-lg font-semibold bg-[#00A086] flex justify-center items-center text-white">
        JD
      </div>
      <div name="details_container" class="flex flex-col p-5 gap-5 w-full overflow-y-auto">
        <div v-for="(detail, index) in userDetails" :key="index">
          <p class="text-xs text-gray-600 pb-1">
            {{ detail.label }}
          </p>
          <p class="text-sm text-primary font-medium">
            {{ detail.value }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
