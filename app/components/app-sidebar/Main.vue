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

import NavMain from '@/components/app-sidebar/NavMain.vue'
import NavUser from '@/components/app-sidebar/NavUser.vue'
import TeamSwitcher from '@/components/app-sidebar/TeamSwitcher.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import NavProjects from '~/components/app-sidebar/NavProjects.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const data = {
  navMain: [
    { title: 'Dashboard', url: '/app/dashboard', icon: LayoutDashboard },
    { title: 'SMS AI', url: '/app/sms-ai', icon: MessageSquareText },
    { title: 'Chat AI', url: '/app/chat-ai', icon: BotMessageSquare },
    {
      title: 'Start Dailing',
      url: '/start-dailing',
      icon: Settings2,
      items: [
        { title: 'General', url: '/start-dailing/general' },
        { title: 'Team', url: '/start-dailing/team' },
        { title: 'Billing', url: '/start-dailing/billing' },
        { title: 'Limits', url: '/start-dailing/limits' },
      ],
    },
    { title: 'Ringless Voicemail', url: '/ringless-voicemail', icon: Voicemail },
    { title: 'Mailbox', url: '/mailbox', icon: Mailbox },
    { title: 'SMS', url: '/sms', icon: MessageSquareMore },
  ],
  navMain2: [
    { title: 'Campaign', url: '/campaign', icon: Megaphone },
    { title: 'Do Not Call', url: '/do-not-call', icon: Bot },
    { title: 'Lead Management', url: '/lead-management', icon: UsersRound },
  ],
  navMain3: [
    { title: 'User Management', url: '/user-management', icon: UserRoundCog },
    { title: 'Inbound Settings', url: '/inbound-settings', icon: Bot },
    { title: 'Configuration', url: '/configuration', icon: BookOpen },
    { title: 'Report', url: '/report', icon: BookOpen },
  ],
  projects: [
    { name: 'Report', url: '/projects/report', icon: Frame },
  ],
}
</script>

<template>
  <Sidebar v-bind="props" class="text-primary">
    <SidebarHeader>
      <SidebarTrigger class="mx-auto hidden md:block" />
    </SidebarHeader>
    <SidebarContent class="pb-10">
      <NavMain :items="data.navMain" heading="MAIN MENU" />
      <SidebarSeparator class="max-w-[250px] mx-auto" />
      <NavMain :items="data.navMain2" heading="CAMPAIGN & LEAD MANAGEMENT" />
      <SidebarSeparator class="max-w-[250px] mx-auto" />
      <NavMain :items="data.navMain3" heading="USER & ACCESS MANAGEMENT" />
      <!-- <NavProjects :projects="data.projects" /> -->
    </SidebarContent>
    <!-- <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter> -->
    <SidebarRail />
  </Sidebar>
</template>
