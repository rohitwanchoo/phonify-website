<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <BaseHeader title="#List1">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" />
        <Icon class="absolute top-[9px] right-2" name="lucide:search" />
      </div>
      <Nuxt-link to="/app/campaign/new-campaign">
        <Button>
          <Icon class="!text-white" name="lucide:download" />
          Download
        </Button>
      </Nuxt-link>
    </template>
  </BaseHeader>
  <LeadManagementListsLeadsTable />
</template>
