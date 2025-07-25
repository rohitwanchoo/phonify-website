<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const { data: ringlessCampaign, status: ringlessCampaignStatus, refresh: ringlessCampaignRefresh } = await useLazyAsyncData('ringless-campaign', () =>
  useApi().get('/ringless/campaign', {
    start: 0,
    limit: 10,
    search: '',
  }), {
  transform: res => res,
})
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Ringless Voicemail Campaigns">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Nuxt-link to="/app/ringless-voicemail/campaign/new-campaign">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Create Campaign
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <RinglessVoicemailCampaignTable :list="ringlessCampaign?.data || []" :loading="ringlessCampaignStatus === 'pending'" @refresh="ringlessCampaignRefresh" />
    </div>
  </div>
</template>
