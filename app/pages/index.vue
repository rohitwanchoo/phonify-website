<script setup lang="ts">
// Set page title
useHead({
  title: 'Phonify - Secure Authentication System',
})
definePageMeta({
  layout: 'empty',
})
</script>

<template>
  <div>
    <!-- Navigation -->
    <!-- <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              Phonify
            </h1>
          </div> -->

          <!-- Auth State Component for safe rendering -->
          <!-- <AuthState>
            <template #default="{ loggedIn, user, clear }">
              <div v-if="loggedIn" class="flex items-center space-x-4">
                <span class="text-sm text-gray-700">
                  Welcome, {{ user?.name || user?.email }}
                </span>
                <NuxtLink
                  to="/app/dashboard"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </NuxtLink>
                <button
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  @click="clear"
                >
                  Logout
                </button>
              </div>
              <div v-else class="flex items-center space-x-4">
                <NuxtLink
                  to="/auth/login"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </NuxtLink>
              </div>
            </template>
            <template #placeholder>
              <div class="flex items-center space-x-4">
                <div class="bg-gray-300 animate-pulse h-8 w-16 rounded" />
              </div>
            </template>
          </AuthState>
        </div>
      </div>
    </nav> -->

    <!-- Hero Section -->
    <!-- <main class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span class="text-blue-600">Phonify</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          A comprehensive authentication system built with Nuxt 4 and nuxt-auth-utils,
          integrated with external API backend.
        </p> -->

        <!-- Auth State for main content -->
        <!-- <AuthState>
          <template #default="{ loggedIn, user }">
            <div class="mt-10">
              <div v-if="loggedIn" class="space-y-4">
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                  <p class="font-medium">
                    ✅ You are authenticated!
                  </p>
                  <p class="text-sm">
                    Logged in as: {{ user?.email }}
                  </p>
                </div>
                <div class="space-x-4">
                  <NuxtLink
                    to="/app/dashboard"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </NuxtLink>
                </div>
              </div>
              <div v-else class="space-y-4">
                <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                  <p class="font-medium">
                    🔐 Authentication Required
                  </p>
                  <p class="text-sm">
                    Please log in to access protected features.
                  </p>
                </div>
                <div class="space-x-4">
                  <NuxtLink
                    to="/auth/login"
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Sign In
                  </NuxtLink>
                </div>
              </div>
            </div>
          </template>
          <template #placeholder>
            <div class="mt-10">
              <div class="bg-gray-100 animate-pulse h-20 w-80 mx-auto rounded-lg" />
            </div>
          </template>
        </AuthState> -->

        <!-- Features Section -->
        <!-- <div class="mt-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-8">
            Authentication Features
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow">
              <div class="text-blue-600 text-3xl mb-4">
                🔐
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Secure Sessions
              </h3>
              <p class="text-gray-600">
                Encrypted cookie-based sessions with nuxt-auth-utils
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <div class="text-green-600 text-3xl mb-4">
                🌐
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                External API
              </h3>
              <p class="text-gray-600">
                Integrated with Phonify API for authentication
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <div class="text-purple-600 text-3xl mb-4">
                🛡️
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                Route Protection
              </h3>
              <p class="text-gray-600">
                Middleware-based route protection and access control
              </p>
            </div>
          </div>
        </div> -->
      <!-- </div>
    </main> -->
    <!-- <PublicSectionsHomeHero /> -->
    <PublicSectionsHomeAboutUs />
    <PublicSectionsHomeSolutions />
    <!-- <PublicSectionsHomeAppIntro /> -->
    <!-- <PublicSectionsHomeBlogs /> -->
    <!-- <PublicSectionsHomeFaq /> -->
  </div>
</template>
