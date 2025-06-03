<script setup lang="ts">
import { ref } from 'vue'
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
  <BaseHeader title="Profile" class="text-primary" orientation="vertical" />
  <div class="grid grid-cols-[66.6667%_33.3333%] gap-2 h-full">
    <!-- Left Side -->
    <div class="h-full rounded border">
      <Tabs v-model="currentTab" class="h-full" orientation="vertical">
        <div class="grid grid-cols-[40%_60%] h-full">
          <!-- Sidebar Tabs -->
          <div>
            <TabsList class="py-3 px-4 flex justify-start flex-col w-full h-full bg-primary rounded-r-none">
              <TabsTrigger
                value="account"
                class="text-left text-white data-[state=active]:text-primary max-h-14 px-4 w-full block mx-auto mb-2"
              >
                <Icon name="icons:dashboard" /> Edit Profile
              </TabsTrigger>
              <TabsTrigger
                value="password"
                class="text-white data-[state=active]:text-primary text-left max-h-14 px-4 w-full block mx-auto mb-2"
              >
                <Icon name="icons:dashboard" /> Change Password
              </TabsTrigger>
              <TabsTrigger
                value="voicemail"
                class="text-white data-[state=active]:text-primary text-left max-h-14 px-4 w-full block mx-auto mb-2"
              >
                <Icon name="icons:dashboard" /> Voicemail Drop
              </TabsTrigger>
              <TabsTrigger
                value="aireplies"
                class="text-white data-[state=active]:text-primary text-left max-h-14 px-4 w-full block mx-auto mb-2"
              >
                <Icon name="icons:dashboard" /> Voice AI
              </TabsTrigger>
            </TabsList>
          </div>

          <!-- Tab Content -->
          <div class="p-4 flex flex-col h-full">
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
            <div class="sticky bottom-0 left-0 right-0 bg-primary border-t mt-4 rounded-[8px] flex justify-center items-center ">
              <Button type="submit" form="form" class="w-full px-4 py-3 text-white text-sm ">
                {{ tabButtonText[currentTab] }}
                <Icon name="material-symbols:save-rounded" />
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>

    <!-- Right Side -->
    <div class="h-full rounded-sm bg-[#F4F4F5]">
      <ProfileDetails :user="user" />
    </div>
  </div>
</template>
