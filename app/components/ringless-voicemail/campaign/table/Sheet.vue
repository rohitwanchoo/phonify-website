<script setup lang="ts">
import moment from 'moment'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  campaign: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:open'])

const sheetOpen = computed({
  get() {
    return props.open
  },
  set(value) {
    emit('update:open', value)
  },
})
</script>

<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Campaign Details</SheetTitle>
        <SheetDescription>
          Viewing details for campaign: {{ campaign?.title }}
        </SheetDescription>
      </SheetHeader>
      <div v-if="campaign" class="grid gap-4 py-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium">
              Schedule Time
            </h4>
            <p>{{ campaign.call_time_start }} - {{ campaign.call_time_end }}</p>
          </div>
          <div>
            <h4 class="font-medium">
              Leads
            </h4>
            <p>{{ campaign.min_lead_temp }}/{{ campaign.max_lead_temp }}</p>
          </div>
          <div>
            <h4 class="font-medium">
              Total Lists
            </h4>
            <p>{{ campaign.group_id }}</p>
          </div>
          <div>
            <h4 class="font-medium">
              Created Date
            </h4>
            <p>{{ moment(campaign.updated).format('LLL') }}</p>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
