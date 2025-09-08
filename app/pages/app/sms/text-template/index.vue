<script setup lang="ts">
import { Button } from '~/components/ui/button'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="SMS Template List">
      <template #actions>
        <BaseInputSearch v-model="search" class="w-[300px]" @update:model-value="searchText" placeholder="Search" />
        <NuxtLink to="/app/sms/text-template/create">
          <Button class="h-11">
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
