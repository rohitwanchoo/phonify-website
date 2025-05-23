<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Call Times">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Nuxt-link to="/app/campaign/new-campaign">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Create Call Time
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <Call-timesTable />
    </div>
  </div>
</template>
