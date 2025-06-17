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
    active: true,
  },
]
</script>

<template>
  <BaseHeader title="john Doe" :breadcrumbs="breadcrumbs">
    <template #actions>
      <Button class="h-11">
        <Icon name="icons:export" class="text-sm" />
         Export
      </Button>
    </template>
  </BaseHeader>
  <div class="grid grid-cols-12 gap-4">
    <div class="col-span-4">
      <LeadManagementLeadDetails />
    </div>
    <div class="col-span-8">
      <LeadManagementLeadLeadTabs />
    </div>
  </div>
  
</template>
