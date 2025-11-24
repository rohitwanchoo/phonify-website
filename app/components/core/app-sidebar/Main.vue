<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import NavMain from '@/components/core/app-sidebar/NavMain.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
})

const route = useRoute()

watch(() => route.path, (path) => {
  if (path === '/app/start-dialing') {
    navigateTo('/app/start-dialing/lead-details')
  }
})

const data = {
  'Main Menu': [{ title: 'Dashboard', url: '/app/dashboard', icon: 'material-symbols:dashboard', disabled: false }],
  'Communication & Lead Management': [
    { title: 'Start Dialing', url: '/app/start-dialing', icon: 'icons:start-dialing', disabled: false },
    { title: 'Campaign', url: '/app/campaign', icon: 'icons:campaign', disabled: false, items: [
      { title: 'Campaign', url: '/app/campaign', disabled: false },
      { title: 'Agent Status', url: '/app/campaign/agent-status', disabled: false },
      { title: 'Disposition', url: '/app/campaign/disposition', disabled: false },
      // { title: 'Marketing Campaign', url: '/app/campaign/marketing-campaign', disabled: false },
    ] },
    // { title: 'Do Not Call', url: '/do-not-call', icon: 'icons:do-not-call', disabled: true, items: [
    //   { title: 'DNC', url: '/app/do-not-call/dnc', disabled: false },
    //   { title: 'Exclude From List', url: '/app/do-not-call/exclude-from-list', disabled: false },
    // ] },
    { title: 'Lead Management', url: '/app/lead-management', icon: 'icons:lead-management', disabled: false, items: [
      { title: 'Label', url: '/app/lead-management/label', disabled: false },
      { title: 'Custom Field Label', url: '/app/lead-management/custom-field-label', disabled: false },
      { title: 'Lead', url: '/app/lead-management/lead', disabled: false },
      { title: 'List', url: '/app/lead-management/list', disabled: false },
      { title: 'Recycle Rule', url: '/app/lead-management/recycle-rule', disabled: false },
    ] },
    { title: 'Call Times', url: '/app/call-times', icon: 'icons:do-not-call', disabled: false },
  ],

  'Administration & Analytics': [
    { title: 'User Management', url: '/user-management', icon: 'icons:user-management', disabled: false, items: [
      { title: 'Extension', url: '/app/user-management/extension', disabled: false },
      { title: 'Group', url: '/app/user-management/group', disabled: false },
      { title: 'Ring Groups', url: '/app/user-management/ring-group', disabled: false },

    ] },
    { title: 'Inbound Settings', url: '/app/inbound-settings', icon: 'icons:inbound-settings', disabled: false, items: [
      { title: 'DID configuration', url: '/app/inbound-settings/did-configuration', disabled: false },
      { title: 'Call Times', url: '/app/inbound-settings/call-times', disabled: false },
      { title: 'Holidays', url: '/app/inbound-settings/holidays', disabled: false },
      { title: 'IVR', url: '/app/inbound-settings/ivr', disabled: false },
      { title: 'Audio Messages', url: '/app/inbound-settings/audio-messages', disabled: false },
    ] },
    { title: 'Configuration', url: '/app/configuration', icon: 'icons:configuration', disabled: false, items: [
      // { title: 'API', url: '/app/configuration/api', disabled: false },
      // { title: 'VoIP Configuration', url: '/app/configuration/voip-configuration', disabled: false },
      // { title: 'Email Templates', url: '/app/configuration/email-templates', disabled: false },
      // { title: 'Voice Templates', url: '/app/configuration/voice-templates', disabled: false },
      // { title: 'IP Settings', url: '/app/configuration/ip-settings', disabled: false },
      // { title: 'Company Settings', url: '/app/configuration/company-settings', disabled: false },
      // { title: 'SMTP Settings', url: '/app/configuration/smtp-settings', disabled: false },
      // { title: 'Custom Field Values', url: '/app/configuration/custom-field-values', disabled: false },
      // { title: 'Allowed IPs', url: '/app/configuration/allowed-ips', disabled: false },
      { title: 'AI Prompts', url: '/app/configuration/ai-prompts', disabled: false },
    ] },
    { title: 'Report', url: '/app/report', icon: 'icons:report', disabled: false, items: [
      { title: 'Call Transfer ', url: '/app/report/call-transfer', disabled: false },
      { title: 'Live Call', url: '/app/report/live-call', disabled: false },
      { title: 'IVR Logs', url: '/app/report/ivr-logs', disabled: false },
      { title: 'Call Data Reports', url: '/app/report/call-data-reports', disabled: false },
      // TODO: Callback api integration
      // { title: 'Callback', url: '/app/report/callback', disabled: false },
      { title: 'Caller ID Name Reports', url: '/app/report/caller-id-name-reports', disabled: false },
      { title: 'Count Report', url: '/app/report/count-report', disabled: false },
      { title: 'Login History', url: '/app/report/login-history', disabled: false },
    ] },
    // { title: 'Calendar', url: '/app/calendar', icon: 'icons:calendar', disabled: true },

    // { title: 'Notifications', url: '/app/notifications', icon: 'icons:report', disabled: true },
  ],

  'More Feature Coming Soon': [
    { title: 'Do Not Call', url: '/do-not-call', icon: 'icons:do-not-call', disabled: true, items: [
      { title: 'DNC', url: '/app/do-not-call/dnc', disabled: false },
      { title: 'Exclude From List', url: '/app/do-not-call/exclude-from-list', disabled: false },
    ] },
    { title: 'Calendar', url: '/app/calendar', icon: 'icons:calendar', disabled: true },
    { title: 'Notifications', url: '/app/notifications', icon: 'icons:report', disabled: true },
    { title: 'SMS AI', url: '/app/sms-ai', icon: 'icons:sms-ai', disabled: true },
    { title: 'Chat AI', url: '/app/chat-ai', icon: 'icons:chat-ai', disabled: true },
    { title: 'Ringless Voicemail', url: '/app/ringless-voicemail', icon: 'material-symbols:voicemail-2', disabled: true, items: [
      { title: 'Campaign', url: '/app/ringless-voicemail/campaign', disabled: false },
      { title: 'Lists', url: '/app/ringless-voicemail/lists', disabled: false },
      // { title: 'Payments', url: '/app/ringless-voicemail/payments', disabled: false },
      // { title: 'Recharge', url: '/app/ringless-voicemail/recharge', disabled: false },
      { title: 'Reports', url: '/app/ringless-voicemail/reports', disabled: false },
      // { title: 'Balance', url: '/app/ringless-voicemail/balance', disabled: false },
      // { title: 'Wallet Transactions', url: '/app/ringless-voicemail/wallet-transactions', disabled: false },
      { title: 'Voice Template', url: '/app/ringless-voicemail/voice-template', disabled: false },
      { title: 'SIP Gateways', url: '/app/ringless-voicemail/sip-gateways', disabled: false },
    ] },
    { title: 'Mailbox', url: '/app/mailbox', icon: 'icons:mailbox', disabled: true },
    { title: 'SMS', url: '/sms', icon: 'icons:sms', disabled: true, items: [
      { title: 'Chat SMS', url: '/app/sms/chat-sms', disabled: false },
      { title: 'SMS History', url: '/app/sms/sms-history', disabled: false },
      { title: 'Text Template', url: '/app/sms/text-template', disabled: false },
    ] },
    { title: 'Fax', url: '/app/fax', icon: 'icons:fax', disabled: true },
    { title: 'Email', url: '/app/email', icon: 'icons:mailbox', disabled: true },
    { title: 'Subscriptions', url: '/app/subscriptions', icon: 'icons:subscriptions', disabled: true },
  ],
  // 'Services': [
  // { title: 'SMS AI', url: '/app/sms-ai', icon: 'icons:sms-ai', disabled: true },
  // { title: 'Chat AI', url: '/app/chat-ai', icon: 'icons:chat-ai', disabled: true },
  // { title: 'Ringless Voicemail', url: '/app/ringless-voicemail', icon: 'material-symbols:voicemail-2', disabled: true, items: [
  //   { title: 'Campaign', url: '/app/ringless-voicemail/campaign', disabled: false },
  //   { title: 'Lists', url: '/app/ringless-voicemail/lists', disabled: false },
  //   // { title: 'Payments', url: '/app/ringless-voicemail/payments', disabled: false },
  //   // { title: 'Recharge', url: '/app/ringless-voicemail/recharge', disabled: false },
  //   { title: 'Reports', url: '/app/ringless-voicemail/reports', disabled: false },
  //   // { title: 'Balance', url: '/app/ringless-voicemail/balance', disabled: false },
  //   // { title: 'Wallet Transactions', url: '/app/ringless-voicemail/wallet-transactions', disabled: false },
  //   { title: 'Voice Template', url: '/app/ringless-voicemail/voice-template', disabled: false },
  //   { title: 'SIP Gateways', url: '/app/ringless-voicemail/sip-gateways', disabled: false },
  // ] },
  // { title: 'Mailbox', url: '/app/mailbox', icon: 'icons:mailbox', disabled: true },
  // { title: 'SMS', url: '/sms', icon: 'icons:sms', disabled: true, items: [
  //   { title: 'Chat SMS', url: '/app/sms/chat-sms', disabled: false },
  //   { title: 'SMS History', url: '/app/sms/sms-history', disabled: false },
  //   { title: 'Text Template', url: '/app/sms/text-template', disabled: false },
  // ] },
  // { title: 'Fax', url: '/app/fax', icon: 'icons:fax', disabled: true },
  // { title: 'Email', url: '/app/email', icon: 'icons:mailbox', disabled: true },

  // ],
  // 'Payment & Subscriptions': [
  // { title: 'Billing', url: '/app/billing', icon: 'icons:billing', disabled: false, items: [
  //   { title: 'Invoice', url: '/app/billing/invoice', disabled: false },
  //   { title: 'Recharge', url: '/app/billing/recharge', disabled: false },
  //   { title: 'Wallet Transactions', url: '/app/billing/wallet-transactions', disabled: false },
  //   { title: 'Payment Methods', url: '/app/billing/payment-methods', disabled: false },
  // ] },
  // { title: 'Subscriptions', url: '/app/subscriptions', icon: 'icons:subscriptions', disabled: true },
  // ],

  // projects: [
  //   { name: 'Report', url: '/projects/report', icon: Frame, disabled: false },
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

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 2px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: transparent;
}
</style>
