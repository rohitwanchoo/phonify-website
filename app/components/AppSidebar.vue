<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from 'lucide-vue-next'
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'
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

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: SquareTerminal,
      isActive: true,

    },
    {
      title: 'SMS AI',
      url: '#',
      icon: Bot,
    },
    {
      title: 'Chat AI',
      url: '#',
      icon: BookOpen,

    },
    {
      title: 'Start Dailing',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
    {
      title: 'Ringless Voicemail',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Mailbox',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'SMS',
      url: '#',
      icon: Settings2,
    },
  ],
  navMain2: [
    {
      title: 'Campaign',
      url: '#',
      icon: SquareTerminal,
      isActive: true,

    },
    {
      title: 'Do Not Call',
      url: '#',
      icon: Bot,
    },
    {
      title: 'Lead Management',
      url: '#',
      icon: BookOpen,

    },
  ],
  navMain3: [
    {
      title: 'User Management',
      url: '#',
      icon: SquareTerminal,
      isActive: true,

    },
    {
      title: 'Inbound Settings',
      url: '#',
      icon: Bot,
    },
    {
      title: 'Configuration',
      url: '#',
      icon: BookOpen,

    },
  ],
  projects: [
    {
      name: 'Report',
      url: '#',
      icon: Frame,
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props" class="text-primary">
    <SidebarHeader>
      <SidebarTrigger class="mx-auto hidden md:block" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" heading="MAIN MENU" />
      <!-- <SidebarSeparator /> -->
      <NavMain :items="data.navMain2" heading="CAMPAIGN & LEAD MANAGEMENT" />
      <!-- <SidebarSeparator /> -->
      <NavMain :items="data.navMain3" heading="USER & ACCESS MANAGEMENT" />

      <!-- <NavProjects :projects="data.projects" /> -->
    </SidebarContent>
    <!-- <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter> -->
    <SidebarRail />
  </Sidebar>
</template>
