<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

// list voice template
const { data: voiceTemplateList, refresh: voiceTemplateRefresh, status: voiceTemplateStatus } = await useLazyAsyncData('voice-template-list', () =>
  useApi().get('/voice-templete'), {
  transform: res => res.data,
})

const loading = computed(() => voiceTemplateStatus.value === 'pending')
</script>

<template>
  <div>
    <BaseHeader title="Voice Templates">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search Template" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Nuxt-link to="/app/configuration/voice-templates/add">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Add Voice Templates
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>
  </div>
  <div>
    <ConfigurationVoiceTemplatesTable :loading="loading" :list="voiceTemplateList" />
  </div>
</template>
