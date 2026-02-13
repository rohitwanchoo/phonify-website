<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

const { login } = useAuth()
const router = useRouter()

interface LoginForm {
  email: string
  password: string
}

const form = ref<LoginForm>({
  email: '',
  password: '',
})

const isLoading = ref(false)
const error = ref('')

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Handle form submission
async function handleLogin() {
  error.value = ''

  if (!form.value.email || !form.value.password) {
    error.value = 'Please fill in all fields'
    return
  }

  if (!isValidEmail(form.value.email)) {
    error.value = 'Please enter a valid email address'
    return
  }

  isLoading.value = true

  try {
    await login({
      email: form.value.email,
      password: form.value.password,
    })

    // Redirect to dashboard on successful login
    await router.push('/app/dashboard')
  }
  catch (err: unknown) {
    const errorObj = err as { data?: { message?: string }, statusMessage?: string }
    error.value = errorObj.data?.message || errorObj.statusMessage || 'Login failed. Please try again.'
  }
  finally {
    isLoading.value = false
  }
}

// Handle Enter key press
function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <form class="mb-[25px]" role="form" aria-label="Login form" @submit.prevent="handleLogin">
    <!-- Error message -->
    <div
      v-if="error"
      class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <p id="login-error" class="text-sm text-red-600">
        {{ error }}
      </p>
    </div>

    <div class="mb-[16px]">
      <label class="text-sm text-[#0C1421] block mb-1" for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        class="w-full h-[52px] border border-[#E0E8E7] p-[16px] rounded-[8px] bg-[#F8F8F8]"
        placeholder="Enter your Email"
        aria-label="Email address"
        :aria-describedby="error ? 'login-error' : undefined"
        :aria-invalid="error ? 'true' : 'false'"
        :disabled="isLoading"
        required
        @keypress="handleKeyPress"
      >
    </div>
    <div>
      <label class="text-sm text-[#0C1421] block mb-1" for="password">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        autocomplete="current-password"
        class="w-full h-[52px] border border-[#E0E8E7] p-[16px] rounded-[8px] bg-[#F8F8F8]"
        placeholder="Enter Password"
        aria-label="Password"
        :aria-describedby="error ? 'login-error' : undefined"
        :aria-invalid="error ? 'true' : 'false'"
        :disabled="isLoading"
        required
        @keypress="handleKeyPress"
      >
      <div class="flex justify-end mt-4">
        <NuxtLink to="/auth/forgot-password" class="text-sm text-[#0C1421] cursor-pointer hover:underline">
          Forgot Password?
        </NuxtLink>
      </div>
    </div>
  </form>

  <div>
    <Button
      type="submit"
      class="bg-[#162D3A] text-white font-normal text-base w-full h-[52px] rounded-[12px] disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="isLoading"
      :aria-busy="isLoading"
      aria-label="Sign in to your account"
      @click="handleLogin"
    >
      <span v-if="isLoading" class="flex items-center justify-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Signing in...</span>
      </span>
      <span v-else>Sign in</span>
    </Button>
  </div>
  <div class="text-sm mt-[40px] flex justify-center">
    <span class="text-[#313957]">
      Don't have an account?
    </span>
    <NuxtLink to="/auth/signup" class="underline text-[#162D3A] font-semibold pl-[5px]">
      Sign up
    </NuxtLink>
  </div>
</template>
