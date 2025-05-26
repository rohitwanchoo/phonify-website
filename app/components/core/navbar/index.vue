<script lang="ts" setup>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarTrigger,
} from '@/components/ui/sidebar'

const { user, logout } = useAuth()
const router = useRouter()

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
</script>

<template>
  <div class="w-full bg-secondary text-primary h-[45px] lg:h-[63px] flex items-center justify-between md:justify-end px-4">
    <SidebarTrigger class="md:hidden" />

    <div class="flex gap-3 text-xs md:text-sm items-center">
      <!-- Notifications Button -->
      <button class="bg-white px-3 py-2 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors">
        <Icon name="material-symbols-light:notifications" class="text-xl md:text-2xl" />
      </button>

      <!-- User Dropdown -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="bg-white px-3 py-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <div class="flex items-center gap-2">
              <!-- User Avatar -->
              <div class="w-6 h-6 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-medium">
                {{ userInitials }}
              </div>

              <!-- User Name -->
              <span class="hidden sm:inline-block max-w-24 md:max-w-32 truncate">
                {{ displayName }}
              </span>

              <!-- Dropdown Arrow -->
              <Icon name="material-symbols:keyboard-arrow-down" class="text-lg md:text-xl" />
            </div>
          </button>
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

          <DropdownMenuItem as-child>
            <NuxtLink to="/app/settings" class="cursor-pointer">
              <Icon name="material-symbols:settings-outline" class="mr-2 h-4 w-4" />
              <span>Settings</span>
            </NuxtLink>
          </DropdownMenuItem>

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
