<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  BookOpen,
  Bot,
  BotMessageSquare,
  Frame,
  LayoutDashboard,
  Mailbox,
  Megaphone,
  MessageSquareMore,
  MessageSquareText,
  Settings2,
  UserRoundCog,
  UsersRound,
  Voicemail,
} from 'lucide-vue-next'

import NavMain from '@/components/core/app-sidebar/NavMain.vue'
import NavProjects from '@/components/core/app-sidebar/NavProjects.vue'
import NavUser from '@/components/core/app-sidebar/NavUser.vue'
import TeamSwitcher from '@/components/core/app-sidebar/TeamSwitcher.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const data = {
  'Main Menu': [
    { title: 'Dashboard', url: '/app/dashboard', icon: 'material-symbols:dashboard' },
    { title: 'SMS AI', url: '/app/sms-ai', icon: 'icons:sms-ai' },
    { title: 'Chat AI', url: '/app/chat-ai', icon: 'icons:chat-ai' },
    { title: 'Start Dailing', url: '/app/start-dialing', icon: 'icons:start-dialing' },
    { title: 'Ringless Voicemail', url: '/ringless-voicemail', icon: 'icons:ringless-voicemail' },
    { title: 'Mailbox', url: '/mailbox', icon: 'icons:mailbox' },
    { title: 'SMS', url: '/sms', icon: 'icons:sms' },
  ],
  'Campaign & Lead Management': [
    { title: 'Campaign', url: '/app/campaign', icon: 'icons:campaign', items: [
      { title: 'Campaign', url: '/app/campaign' },
      { title: 'Agent Status', url: '/start-campaign/agent-status' },
      { title: 'Diposition', url: '/campaign/diposition' },

    ] },
    { title: 'Do Not Call', url: '/do-not-call', icon: 'icons:do-not-call' },
    { title: 'Lead Management', url: '/lead-management', icon: 'icons:lead-management' },
    { title: 'Call Times', url: '/app/call-times', icon: 'icons:do-not-call' },
  ],
  'User & Access Management': [
    { title: 'User Management', url: '/user-management', icon: 'icons:user-management', items: [
      { title: 'Extension', url: '/app/user-management/extension' },
      { title: 'Group', url: '/app/user-management/group' },
      { title: 'Ring Groups', url: '/app/ring-groups' },

    ] },
    { title: 'Inbound Settings', url: '/inbound-settings', icon: 'icons:inbound-settings' },
    { title: 'Configuration', url: '/configuration', icon: 'icons:configuration' },
    { title: 'Report', url: '/report', icon: 'icons:report' },
    { title: 'Notifications', url: '/app/notifications', icon: 'icons:report' },
  ],
  // projects: [
  //   { name: 'Report', url: '/projects/report', icon: Frame },
  // ],
}
</script>

<template>
  <Sidebar v-bind="props" class="text-primary">
    <SidebarHeader>
      <SidebarTrigger class="mx-auto hidden md:block" />
    </SidebarHeader>
    <SidebarContent class="pb-10">
      <NavMain :items="data" />
    </SidebarContent>
    <!-- <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter> -->
    <SidebarRail />
  </Sidebar>
</template>
