<script setup lang="ts">
// Protect this page with authentication
definePageMeta({
  middleware: 'auth',
})

const { user, session, logout } = useAuth()
const api = useApi()

// Logout state
const loggingOut = ref(false)

// API test state
const apiLoading = ref(false)
const apiResult = ref(null)
const apiError = ref('')

// Handle logout
async function handleLogout() {
  loggingOut.value = true
  try {
    await logout()
    await navigateTo('/auth/login')
  }
  catch (error) {
    console.error('Logout error:', error)
  }
  finally {
    loggingOut.value = false
  }
}

// Test API call with authentication
async function testApiCall() {
  apiLoading.value = true
  apiResult.value = null
  apiError.value = ''

  try {
    // Replace with an actual endpoint from your API
    const result = await api.get('/user/profile') // Example endpoint
    apiResult.value = result
  }
  catch (error: any) {
    console.error('API test error:', error)
    apiError.value = error.statusMessage || 'API call failed'
  }
  finally {
    apiLoading.value = false
  }
}

// Format date helper
function formatDate(dateString?: string) {
  if (!dateString)
    return 'Unknown'
  return new Date(dateString).toLocaleString()
}

// Set page title
useHead({
  title: 'Profile - Phonify',
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              Profile (for testing)
            </h1>
          </div>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">
              Welcome, {{ user?.name || user?.email }}
            </span>
            <button
              :disabled="loggingOut"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              @click="handleLogout"
            >
              {{ loggingOut ? 'Logging out...' : 'Logout' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">
              🎉 Authentication Successful!
            </h2>
            <p class="text-gray-600 mb-6">
              You are now logged in and can access protected content.
            </p>

            <!-- User info card -->
            <div class="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                User Information
              </h3>
              <dl class="space-y-2">
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">
                    ID:
                  </dt>
                  <dd class="text-sm text-gray-900">
                    {{ user?.id }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">
                    Email:
                  </dt>
                  <dd class="text-sm text-gray-900">
                    {{ user?.email }}
                  </dd>
                </div>
                <div v-if="user?.name" class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">
                    Name:
                  </dt>
                  <dd class="text-sm text-gray-900">
                    {{ user.name }}
                  </dd>
                </div>
                <div class="flex justify-between">
                  <dt class="text-sm font-medium text-gray-500">
                    Logged in:
                  </dt>
                  <dd class="text-sm text-gray-900">
                    {{ formatDate(session?.loggedInAt) }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- API Test Section -->
            <div class="mt-8">
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                Test API Calls
              </h3>
              <div class="space-y-4">
                <button
                  :disabled="apiLoading"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  @click="testApiCall"
                >
                  {{ apiLoading ? 'Testing...' : 'Test Authenticated API Call' }}
                </button>

                <div v-if="apiResult" class="bg-gray-100 rounded-md p-4 text-left">
                  <pre class="text-sm text-gray-800">{{ JSON.stringify(apiResult, null, 2) }}</pre>
                </div>

                <div v-if="apiError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {{ apiError }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
