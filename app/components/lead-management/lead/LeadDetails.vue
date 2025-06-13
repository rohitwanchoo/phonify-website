<script setup>
import Button from '~/components/ui/button/Button.vue';
// No props or dynamic data needed
function onEdit() {
  console.log('Edit clicked')
}
</script>

<template>
  <div class="max-w-md mx-auto rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-800">
        Lead Details
      </h2>
    <Button class="bg-white text-black border border-black">Edit</Button>
    </div>

    <!-- Details List -->
    <div class="space-y-4">
      <div class="flex justify-between">
        <span class="font-medium">Last Name</span><span>Doe</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">First Name</span><span>John</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">New Label</span><span>Doe</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">No of Open Loans</span><span>3</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Factor Rate</span><span>10%</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Annual Revenue</span><span>$120,000.00</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Business Age</span><span>6Yr</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Credit Score</span><span>813</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Current Phone System</span><span>-</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Monthly Revenue</span><span>$10,000.00</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Funding Amount</span><span>$20,000.00</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Email</span><span>johndoe123@gmail.com</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">Zip</span><span>987237</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium">State</span><span>NewYork</span>
      </div>
      <div class="flex justify-between">
        <span class="font-medium" />
      </div>
    </div>
  </div>
</template>
