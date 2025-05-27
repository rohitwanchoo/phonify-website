<script setup lang="ts">
import { Button } from '@/components/ui/button'

const { stepper, formState, resetFormState } = useCreateCampaign()

const breadcrumbs = [
  {
    label: 'Campaign',
    href: '/app/campaign',
  },
  {
    label: 'Create New Campaign',
    active: true,
  },
]
stepper.goTo('select-list')
</script>

<template>
  <BaseHeader title="Create New Campaign" :breadcrumbs="breadcrumbs">
    <template #actions>
      <Button variant="outline" class="h-11">
        <icon name="material-symbols:save-rounded" size="18" />
        Save as Draft
      </Button>
    </template>
  </BaseHeader>
  <CampaignStepper :stepper="stepper">
    <component :is="stepper.current.value.component" @completed="(e: any) => stepper.goToNext()" @go-to="(e: any) => stepper.goTo(e)" />
  </CampaignStepper>
</template>
