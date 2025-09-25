<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">SIP onInvite Debug Test</h2>
    
    <!-- SIP Status -->
    <div class="mb-6 p-4 border rounded-lg">
      <h3 class="text-lg font-semibold mb-3">SIP Status</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="font-medium">Registered:</span>
          <span :class="sipStatus.isRegistered ? 'text-green-600' : 'text-red-600'">
            {{ sipStatus.isRegistered ? 'Yes' : 'No' }}
          </span>
        </div>
        <div>
          <span class="font-medium">Call Active:</span>
          <span :class="sipStatus.isCallActive ? 'text-green-600' : 'text-red-600'">
            {{ sipStatus.isCallActive ? 'Yes' : 'No' }}
          </span>
        </div>
        <div>
          <span class="font-medium">Call Status:</span>
          <span class="text-blue-600">{{ sipStatus.callStatus }}</span>
        </div>
        <div>
          <span class="font-medium">Initialized:</span>
          <span :class="sipStatus.isInitialized ? 'text-green-600' : 'text-red-600'">
            {{ sipStatus.isInitialized ? 'Yes' : 'No' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="mb-6 space-y-3">
      <button 
        @click="initializeSIP"
        :disabled="sipStatus.isRegistered"
        class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700"
      >
        {{ sipStatus.isRegistered ? 'SIP Already Initialized' : 'Initialize SIP' }}
      </button>
      
      <button 
        @click="testIncomingCall"
        :disabled="!sipStatus.isRegistered"
        class="w-full px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700"
      >
        Simulate Incoming Call Test
      </button>
      
      <button 
        @click="cleanup"
        class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Cleanup SIP
      </button>
    </div>

    <!-- Debug Logs -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">Debug Logs</h3>
      <div class="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
        <div v-if="debugLogs.length === 0" class="text-gray-500">
          No logs yet. Initialize SIP to see debug information.
        </div>
        <div v-for="(log, index) in debugLogs" :key="index" class="mb-2 text-sm">
          <span class="text-gray-500">{{ log.timestamp }}</span>
          <span :class="getLogColor(log.level)" class="ml-2">{{ log.message }}</span>
        </div>
      </div>
      <button 
        @click="clearLogs"
        class="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
      >
        Clear Logs
      </button>
    </div>

    <!-- Instructions -->
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h4 class="font-semibold text-yellow-800 mb-2">Testing Instructions:</h4>
      <ol class="text-sm text-yellow-700 space-y-1">
        <li>1. Click "Initialize SIP" and watch the debug logs</li>
        <li>2. Wait for "SIP registration successful" message</li>
        <li>3. Check that delegate verification shows onInvite function exists</li>
        <li>4. Make a test call to your extension from another phone</li>
        <li>5. Watch for "INCOMING CALL DETECTED!" in the logs</li>
        <li>6. If onInvite doesn't trigger, check transport and registration states</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DebugLog {
  timestamp: string
  level: 'info' | 'success' | 'error' | 'warn'
  message: string
}

const { initializeSIP, cleanup, getSIPStatus } = useSIP()
const sipStatus = ref(getSIPStatus())
const debugLogs = ref<DebugLog[]>([])

function addDebugLog(level: DebugLog['level'], message: string) {
  debugLogs.value.push({
    timestamp: new Date().toLocaleTimeString(),
    level,
    message
  })
  
  // Keep only last 100 logs
  if (debugLogs.value.length > 100) {
    debugLogs.value = debugLogs.value.slice(-100)
  }
}

// Update status periodically
const statusInterval = setInterval(() => {
  sipStatus.value = getSIPStatus()
}, 1000)

onUnmounted(() => {
  clearInterval(statusInterval)
})

// Capture console logs for debugging
const originalConsole = {
  error: console.error,
  warn: console.warn
}

// Override console methods to capture logs
console.error = (...args: any[]) => {
  originalConsole.error(...args)
  addDebugLog('error', args.join(' '))
}

console.warn = (...args: any[]) => {
  originalConsole.warn(...args)
  addDebugLog('warn', args.join(' '))
}

function getLogColor(level: string) {
  switch (level) {
    case 'error': return 'text-red-600'
    case 'success': return 'text-green-600'
    case 'warn': return 'text-yellow-600'
    default: return 'text-blue-600'
  }
}

function testIncomingCall() {
  addDebugLog('info', '🧪 Testing incoming call detection...')
  addDebugLog('info', '📞 Please call your extension from another phone to test onInvite handler')
  addDebugLog('warn', '⚠️ If onInvite doesn\'t trigger, check WebSocket connection and registration status')
}

function clearLogs() {
  debugLogs.value = []
}

// Restore console on unmount
onUnmounted(() => {
  console.error = originalConsole.error
  console.warn = originalConsole.warn
})
</script>