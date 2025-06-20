<script setup lang="ts">
import { Button } from '@/components/ui/button'

const { stepper, formState, resetFormState } = useCreateCampaign()

const breadcrumbs = [
  {
    label: 'Lead',
    href: '/app/lead-management/lead',
  },
  {
    label: 'Lead Activity',
    href: '/app/lead-management/lead/activity',
  },
]
</script>

<template>
  <BaseHeader title="john Doe" :breadcrumbs="breadcrumbs">
    <template #actions>
      <Button class="h-8 md:h-11 px-2 md:px-4 ">
        <Icon name="icons:export" class="text-sm" />
        Export
      </Button>
    </template>
  </BaseHeader>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <div class="lg:col-span-4">
      <LeadManagementLeadDetails />
    </div>
    <div class="lg:col-span-8">
      <LeadManagementLeadLeadTabs />
    </div>
  </div>
</template>
