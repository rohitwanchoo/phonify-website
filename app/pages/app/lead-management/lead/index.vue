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

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 4,
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Manage Leads">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button>
          Search
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <LeadManagementLeadTable :list="dummyLeads" :meta="meta" :loading="false" />
    </div>
  </div>
</template>
