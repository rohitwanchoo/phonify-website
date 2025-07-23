<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="SMS Template List">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <NuxtLink to="/app/sms/text-template/create">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Add SMS Template
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <SmsTextTemplateTable />
    </div>
  </div>
</template>
