<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
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
    <ConfigurationVoiceTemplatesTable />
  </div>
</template>
