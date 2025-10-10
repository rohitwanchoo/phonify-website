<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
// import { endCall, getSIPStatus, startCall } from '~/composables/useSIP'
const { getSIPStatus, startCall, endCall, callerDetails } = useSIPml5()

const { user } = useAuth()

const phoneNumber = ref('')
const sipStatus = ref(getSIPStatus())

// Update status periodically
let statusInterval: NodeJS.Timeout

onMounted(() => {
  // Update SIP status every second
  statusInterval = setInterval(() => {
    sipStatus.value = getSIPStatus()
  }, 1000)
})

onUnmounted(() => {
  if (statusInterval) {
    clearInterval(statusInterval)
  }
})

async function makeCall() {
  if (phoneNumber.value.trim()) {
    await startCall(phoneNumber.value.trim())
  }
}

function hangupCall() {
  endCall()
}
</script>

<template>
  {{ user }}
  {{ callerDetails }}
  <div class="sip-example">
    <h3>SIP Test Component</h3>

    <!-- SIP Status Display -->
    <div class="status-section">
      <p>Registration Status: {{ sipStatus.isRegistered ? 'Registered' : 'Not Registered' }}</p>
      <p>Call Status: {{ sipStatus.callStatus }}</p>
      <p>Call Active: {{ sipStatus.isCallActive ? 'Yes' : 'No' }}</p>
    </div>

    <!-- Call Controls -->
    <div class="controls-section">
      <input
        v-model="phoneNumber"
        type="text"
        placeholder="Enter phone number"
        class="phone-input"
      >

      <button
        :disabled="!sipStatus.isRegistered || sipStatus.isCallActive"
        class="call-btn"
        @click="makeCall"
      >
        Start Call
      </button>

      <button
        :disabled="!sipStatus.isCallActive"
        class="hangup-btn"
        @click="hangupCall"
      >
        End Call
      </button>
    </div>
  </div>
</template>

<style scoped>
.sip-example {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 400px;
}

.status-section {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.controls-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.phone-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.call-btn, .hangup-btn {
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.call-btn {
  background-color: #4CAF50;
  color: white;
}

.call-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.hangup-btn {
  background-color: #f44336;
  color: white;
}

.hangup-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
