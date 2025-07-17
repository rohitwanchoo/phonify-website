<script setup lang="ts">
import moment from 'moment'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

// Dummy data for testing
const dummyLeads = [
  {
    name: 'L-001',
    day: 'John',
    from_time: 'Doe',
    to_time: '9876543210',
    description: 'john@example.com',
    state: 'California',
    legal_company_name: 'Acme Inc.',
  },
  {
    name: 'L-002',
    day: 'Jane',
    from_time: 'Smith',
    to_time: '1234567890',
    description: 'jane@example.com',
    state: 'Texas',
    legal_company_name: 'Beta LLC',
  },
  {
    name: 'L-003',
    day: 'Alice',
    from_time: 'Brown',
    to_time: '5551234567',
    description: 'alice@example.com',
    state: 'New York',
    legal_company_name: 'Gamma Corp.',
  },
  {
    name: 'L-004',
    day: 'Bob',
    from_time: 'White',
    to_time: '5559876543',
    description: 'bob@example.com',
    state: 'Florida',
    legal_company_name: 'Delta Ltd.',
  },
]

const { data: leadsList, refresh: refreshLeads, status: leadsStatus } = await useLazyAsyncData('leads-list', () =>
  useApi().post('/leads', {
    start: 0,
    limit: 10,
  }), {
  transform: res => res.data,
})
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Manage Leads">
      <template #actions>
        <div class="relative mt-4 md:mt-0">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button class="mt-4 md:mt-0">
          Search
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <LeadManagementLeadTable :list="leadsList" :loading="leadsStatus === 'pending'" />
    </div>
  </div>
</template>
