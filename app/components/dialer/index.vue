<script setup>
import Button from '../ui/button/Button.vue'

const selectedCountry = ref('us')
const phoneNumber = ref('')

function appendDigit(digit) {
  phoneNumber.value += digit
}

function backspace() {
  phoneNumber.value = phoneNumber.value.slice(0, -1)
}

function makeCall() {
  alert(`Calling ${phoneNumber.value}`)
}
</script>

<template>
  <div class="max-w-xs mx-auto rounded-2xl overflow-hidden shadow-lg bg-white">
    <div class="bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
      <h2 class="text-sm font-semibold">
        Dialer
      </h2>
      <Button variant="ghost" @click="$emit('close')">
        <Icon name="material-symbols:close" size="24" />
      </Button>
    </div>

    <div class="bg-[#162D3A] p-4 space-y-3">
      <select v-model="selectedCountry" class="w-full px-3 py-2 text-white rounded">
        <option value="us">
          USA & Canada
        </option>
        <option value="in">
          India
        </option>
        <!-- Add more countries -->
      </select>

      <div class="flex items-center space-x-2 rounded px-3 py-2">
        <span>🇺🇸 +1</span>
        <input
          v-model="phoneNumber"
          type="text"
          placeholder="Enter phone number"
          class="flex-1 bg-transparent outline-none text-white placeholder-white"
        >
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 p-6 text-center text-xl font-medium text-gray-800">
      <button v-for="n in 9" :key="n" @click="appendDigit(n)">
        {{ n }}
      </button>
      <span />
      <button @click="appendDigit(0)">
        0
      </button>
      <span />
    </div>

    <div class="flex justify-around px-4 pb-4">
      <Button variant="ghost" class="rounded-full h-[54px] w-[54px]">
        <Icon name="material-symbols:favorite-outline" size="24" class="text-black" />
      </Button>
      <Button class="bg-green-600 hover:bg-green-500 rounded-full h-[54px] w-[54px]" @click="makeCall">
        <Icon name="material-symbols:call" size="24" />
      </Button>
      <Button variant="ghost" class="rounded-full h-[54px] w-[54px]" @click="backspace">
        <Icon name="material-symbols:arrow-back" size="24" />
      </Button>
    </div>
  </div>
</template>
