<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
// import ProfileChangePassword from '~/components/profile/ProfileChangePassword.vue'
// import ProfileDetails from '~/components/profile/ProfileDetails.vue'
// import ProfileEdit from '~/components/profile/ProfileEdit.vue'
// import ProfileVoiceAi from '~/components/profile/ProfileVoiceAi.vue'
// import ProfileVoicemail from '~/components/profile/ProfileVoicemail.vue'

const currentTab = ref('account')

// Map tab values to button labels
const tabButtonText: Record<string, string> = {
  account: 'Update',
  password: 'Update',
  voicemail: 'Save',
  aireplies: 'Save',
}
</script>

<template>
  <BaseHeader title="Recieve Fax" class="text-primary" orientation="vertical" />
  
  <div class="lg:flex gap-2 lg:h-full">
    <!-- Left Side -->
    <div class="lg:h-full lg:w-[75%] mb-4 md:mb-0 rounded-lg border">
      <Tabs v-model="currentTab" class="h-full" orientation="vertical">
        <div class="flex flex-col lg:flex-row h-full">
          <!-- Sidebar Tabs -->
          <div class="lg:w-[30%]">
            <TabsList class="lg:py-3 lg:px-4 p-0 flex justify-center items-center h-15 lg:h-full lg:justify-start lg:flex-col w-full bg-primary rounded-b-none lg:rounded-bl-xl  lg:rounded-r-none">
              <TabsTrigger
                value="account"
                class="text-white whitespace-normal h-full text-wrap lg:rounded-xl text-sm shadow-none rounded-bl-none rounded-r-none data-[state=active]:text-primary  lg:max-h-14 lg:px-4 lg:w-full block lg:mb-2"
              >
                <div class="flex justify-center lg:justify-start items-center gap-1">
                  <Icon name="material-symbols:person" class="h-3 hidden sm:block" />
                 Edit Profile
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="password"
                class="text-white whitespace-normal h-full text-wrap lg:rounded-xl text-sm shadow-none rounded-none data-[state=active]:text-primary lg:max-h-14 lg:px-4 lg:w-full block lg:mb-2"
              >
                <div class="flex justify-center lg:justify-start items-center gap-1">
                  <Icon name="material-symbols:lock" class="h-3 hidden sm:block" />
                  Change Password
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="voicemail"
                class="text-white whitespace-normal h-full text-wrap lg:rounded-xl text-sm shadow-none rounded-none data-[state=active]:text-primary  lg:max-h-14 lg:px-4 lg:w-full block lg:mb-2"
              >
                <div class="flex justify-center lg:justify-start items-center gap-1">
                  <Icon name="material-symbols:voicemail" class="h-3 hidden sm:block" />
                  Voicemail
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="aireplies"
                class="text-white whitespace-normal h-full text-wrap lg:rounded-xl text-sm shadow-none rounded-br-none rounded-l-none data-[state=active]:text-primary lg:max-h-14 lg:px-4 lg:w-full block lg:mb-2"
              >
                <div class="flex justify-center lg:justify-start items-center gap-1">
                  <Icon name="icons:voiceai" class="h-3 hidden sm:block" />
                  Voice AI
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <!-- Tab Content -->
          <div class="lg:w-[70%] flex flex-col h-full max-h-[calc(100vh-138px)]">
            <div class="flex-1 overflow-auto ">
              <TabsContent value="account">
                <ProfileEdit />
              </TabsContent>
              <TabsContent value="password">
                <ProfileChangePassword />
              </TabsContent>
              <TabsContent value="voicemail">
                <ProfileVoicemail />
              </TabsContent>
              <TabsContent value="aireplies">
                <ProfileVoiceAi />
              </TabsContent>
            </div>

            <!-- Sticky Button -->
            <div class="p-5 w-full border-t">
              <Button class="w-full h-13 ">
                {{ tabButtonText[currentTab] }}
              </Button>
            </div>

            <!-- <div class="sticky bottom-0 left-0 right-0 bg-primary border-t mt-4 rounded-[8px] px-5">
              <Button type="submit" form="form" class="w-full px-4 py-3 text-white text-sm h-10">
                <span class="flex items-center justify-center gap-1">
                  <Icon
                    v-if="['voicemail', 'aireplies'].includes(currentTab)"
                    name="material-symbols:save-rounded"
                    class="text-base"
                  />
                  {{ tabButtonText[currentTab] }}
                </span>
              </Button>
            </div> -->
          </div>
        </div>
      </Tabs>
    </div>

    <!-- Right Side -->
    <div class="lg:h-full lg:w-[25%] rounded-lg bg-[#f2faf9]">
      <ProfileDetails :user="user" />
    </div>
  </div>
</template>
