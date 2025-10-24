<script lang="ts" setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

import {
  SidebarTrigger,
} from '@/components/ui/sidebar'

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import Button from '~/components/ui/button/Button.vue'

const { user, logout } = useAuth()
const router = useRouter()

const {
  disconnectWebphone,
  initializeSIP,
  isInitializing,
  isRegistered,
} = useSIPml5()

// Handle logout
async function handleLogout() {
  try {
    await logout()
    await router.push('/auth/login')
  }
  catch (error) {
    console.error('Logout error:', error)
  }
}

// Get user display name
const displayName = computed(() => {
  if (!user.value)
    return 'User'
  return user.value.name || `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim() || user.value.email || 'User'
})

// Get user initials for avatar
const userInitials = computed(() => {
  if (!user.value)
    return 'U'
  const name = displayName.value
  const words = name.split(' ')
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})
const activeTab = ref<'active' | 'inactive'>('inactive')

watch(isRegistered, (newTab) => {
  if (newTab) {
    activeTab.value = 'active'
  }
  else {
    activeTab.value = 'inactive'
  }
})

function handleTabChange(val: any) {
  if (val === 'inactive') {
    disconnectWebphone()
  }
  else {
    initializeSIP()
  }
}
</script>

<template>
  <div class="w-full bg-secondary text-primary h-[45px] lg:h-[63px] flex items-center justify-between md:justify-end px-4 py-[30px]">
    <SidebarTrigger class="md:hidden" />

    <!-- WebsWebphone Status -->
    <div class="flex gap-3 text-xs md:text-sm items-center">
      <div class="bg-white py-1 px-[7px] rounded-[8px] flex items-center gap-2">
        <Icon name="material-symbols:call" size="18" class="text-md" />
        <div class="text-xs">
          Webphone Status :
        </div>
        <Tabs v-model="activeTab" class="rounded-md" @update:model-value="handleTabChange">
          <TabsList class="grid  grid-cols-2 p-[2px] w-[162px] h-[32px]">
            <TabsTrigger :disabled="isInitializing" class="font-normal text-xs data-[state=active]:bg-green-600 data-[state=active]:text-white" value="active">
              <Icon v-if="activeTab === 'active'" size="16" name="material-symbols:radio-button-checked-outline" class="text-md text-white" />
              Active
            </TabsTrigger>
            <TabsTrigger :disabled="isInitializing" class="font-normal text-xs data-[state=active]:bg-[#E8AE24] data-[state=active]:text-white" value="inactive">
              Inactive
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Separator orientation="vertical" height="5px" class="min-h-[40px]" />
      <Button size="icon" class="px-3 bg-white w-max h-10 rounded-md flex items-center justify-center hover:bg-gray-50 text-primary text-xs font-normal gap-x-2">
        <Icon name="material-symbols-light:help" size="24" class="text-black" />
        Help Center
      </Button>
      <!-- Notifications Button -->
      <nuxt-link to="/app/notifications">
        <Button size="icon" class="bg-white w-10 h-10 rounded-md flex items-center justify-center hover:bg-gray-50 text-primary">
          <Icon name="material-symbols-light:notifications" size="24" class="text-black" />
        </Button>
      </nuxt-link>
      <!-- User Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="icon" class="bg-white w-auto rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-3 py-[11px] h-10">
            <div class="flex items-center gap-2">
              <!-- User Avatar -->
              <Icon size="18" name="fa-solid:user-alt" class="text-lg md:text-xl text-primary" />
              <!-- <div class="w-6 h-6 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-medium">
                {{ userInitials }}
              </div> -->

              <!-- User Name -->
              <span class="hidden sm:inline-block max-w-24 md:max-w-32 font-normal text-xs truncate text-primary">
                {{ displayName }}
              </span>

              <!-- Dropdown Arrow -->
              <Icon name="material-symbols:keyboard-arrow-down" class="text-lg md:text-xl text-primary" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" class="w-56">
          <DropdownMenuLabel class="font-normal">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">
                {{ displayName }}
              </p>
              <p class="text-xs leading-none text-muted-foreground">
                {{ user?.email }}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem as-child>
            <NuxtLink to="/app/profile" class="cursor-pointer">
              <Icon name="material-symbols:person-outline" class="mr-2 h-4 w-4" />
              <span>Profile</span>
            </NuxtLink>
          </DropdownMenuItem>

          <!-- For now settings is disabled -->
          <!-- <DropdownMenuItem as-child>
            <NuxtLink to="/app/settings" class="cursor-pointer">
              <Icon name="material-symbols:settings-outline" class="mr-2 h-4 w-4" />
              <span>Settings</span>
            </NuxtLink>
          </DropdownMenuItem> -->

          <DropdownMenuSeparator />

          <DropdownMenuItem class="cursor-pointer text-red-600 focus:text-red-600" @click="handleLogout">
            <Icon name="material-symbols:logout" class="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>
