<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const route = useRoute()

const show = computed(() => {
  const baseRoute = '/app/start-dialing'
  const sidePanel = route.path.startsWith(baseRoute)
  return sidePanel
})

const sidePanel = ref([
  {
    title: 'Lead Details',
    icon: 'material-symbols:person',
    link: '/app/start-dialing/lead-details',
  },
  {
    title: 'Send SMS',
    icon: 'material-symbols:chat',
    link: '/app/start-dialing/send-sms',
  },
  {
    title: 'Send Email',
    icon: 'material-symbols:mail',
    link: '/app/start-dialing/send-email',
  },
  {
    title: 'Agent Script',
    icon: 'material-symbols:script',
    link: '/app/start-dialing/agent-script',
  },
  {
    title: 'Notes',
    icon: 'material-symbols:description',
    link: '/app/start-dialing/notes',
  },
  {
    title: 'Events',
    icon: 'material-symbols:event',
    link: '/app/start-dialing/events',
  },
])

const isActive = (link: string) => route.path.startsWith(link)

onMounted(() => {
  if (route.path === '/app/start-dialing') {
    navigateTo('/app/start-dialing/lead-details')
  }
})
</script>

<template>
  <div class="h-full overflow-y-auto">
    <!-- HEADER -->
    <BaseHeader title="Campaign 1">
      <template #actions>
        <Select>
          <SelectTrigger class="lg:min-w-[300px]">
            <SelectValue placeholder="Web Phone" class="text-xs" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="web-phone">
                Web Phone
              </SelectItem>
              <SelectItem value="mobile-app">
                Mobile App
              </SelectItem>
              <SelectItem value="desk-phone">
                Desk Phone
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </template>
    </BaseHeader>

    <div class="flex max-h-[calc(100vh-166px)] h-full overflow-y-auto mt-6">
      <!-- SIDE PANEL -->
      <div v-if="show" class="lg:min-w-[300px] p-2 bg-primary flex flex-col gap-5 rounded-l-[20px] overflow-y-auto">
        <NuxtLink
          v-for="(item, index) in sidePanel"
          :key="index"
          :data-cy="`${item.title}-navigate`"
          :to="item.link"
          class="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:text-primary"
          :class="isActive(item.link) ? 'bg-white text-primary' : 'bg-primary text-white'"
        >
          <Icon :name="item.icon" size="24" />
          <span class="text-sm">
            {{ item.title }}
          </span>
        </NuxtLink>
      </div>

      <!-- MAIN PANEL -->
      <div class="h-full w-full overflow-y-auto">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
