<script setup>
import Button from '~/components/ui/button/Button.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function onEdit() {
  router.push('/app/lead-management/lead/edit')
}
</script>

<template>
  <div class="max-w-md mx-auto rounded-2xl border border-gray-200  shadow-sm bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-200 pb-4 p-4">
      <h2 class="text-lg font-semibold text-gray-800">
        Lead Details
      </h2>
      <Button class="bg-white text-black border border-black hover:bg-white" @click="onEdit">
        <Icon name="material-symbols:edit-square"/>
        Edit
      </Button>
    </div>

    <!-- Details List -->
    <div class="space-y-2 p-4">
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Last Name</span><span>Doe</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">First Name</span><span>John</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">New Label</span><span>Doe</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">No of Open Loans</span><span>3</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Factor Rate</span><span>10%</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Annual Revenue</span><span>$120,000.00</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Business Age</span><span>6Yr</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Credit Score</span><span>813</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Current Phone System</span><span>-</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Monthly Revenue</span><span>$10,000.00</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Funding Amount</span><span>$20,000.00</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Email</span><span>johndoe123@gmail.com</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Zip</span><span>987237</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">State</span><span>NewYork</span>
      </div>
      <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
        <span class="text-[#162D3AB2]">Legal Company Name</span><span>JD Company</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-[#162D3AB2]" />
      </div>
    </div>
  </div>
</template>
