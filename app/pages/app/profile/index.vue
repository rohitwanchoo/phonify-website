<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileDetails from '~/components/profile/ProfileDetails.vue'
</script>

<template>
  <BaseHeader title="Profile" class="text-primary" orientation="vertical" />
  <div class="grid grid-cols-[66.6667%_33.3333%] gap-2 h-full">
    <!-- Left Side (Main Section with Tabs) -->
    <div class="h-full rounded border ">
      <Tabs default-value="account" class="h-full" orientation="vertical">
        <div class="grid grid-cols-[40%_60%] h-full">
          <!-- Tab Triggers (30%) -->
          <div>
            <TabsList class="py-3 px-4 flex justify-start flex-col w-full h-full bg-primary rounded-r-none">
              <TabsTrigger value="account" class="text-left max-h-14 px-4 w-full block mx-auto mb-2 ">
                <Icon name="icons:dashboard" /> Edit Profile
              </TabsTrigger>
              <TabsTrigger value="password" class="text-left max-h-14 px-4 w-full block mx-auto mb-2">
                <Icon name="icons:dashboard" /> Change Password
              </TabsTrigger>
              <TabsTrigger value="voicemail" class="text-left max-h-14 px-4 w-full block mx-auto mb-2">
                <Icon name="icons:dashboard" /> Voicemail Drop
              </TabsTrigger>
              <TabsTrigger value="aireplies" class=" text-left max-h-14 px-4 w-full block mx-auto mb-2">
                <Icon name="icons:dashboard" /> Voice AI
              </TabsTrigger>
            </TabsList>
          </div>

          <!-- Tab Contents (70%) -->
          <div class="p-4">
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
        </div>
      </Tabs>
    </div>

    <!-- Right Side -->
    <div class="h-full rounded-sm bg-[#F4F4F5]">
      <ProfileDetails />
    </div>
  </div>
</template>
