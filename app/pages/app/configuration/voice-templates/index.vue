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
        <BaseInputSearch class="w-[300px]" placeholder="search" />
        <Nuxt-link to="/app/configuration/voice-templates/add">
          <Button class="h-11">
            <Icon class="!text-white" name="lucide:plus" size="20px" />
            Add Voice Templates
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>
  </div>
  <div>
    <ConfigurationVoiceTemplatesTable :loading="loading" :list="voiceTemplateList" @refresh="voiceTemplateRefresh" />
  </div>
</template>
