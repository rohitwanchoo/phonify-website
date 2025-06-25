<script setup lang="ts">
import moment from 'moment'
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

// Dummy data for testing
const dummyLeads = [
  {
    api_name: 'API#',
    campaign_name: 'Campaign 1',
    url: 'https://phonify.com/site/demo',
    method: 'GET',
    status: 'Active',
    api_template: 'Yes',
    date_created: '28/04/2025 02:45 PM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 1',
    url: 'https://phonify.com/site/demo',
    method: 'POST',
    status: 'Active',
    api_template: 'No',
    date_created: '29/04/2025 09:10 AM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 3',
    url: 'https://phonify.com/site/demo',
    method: 'PUT',
    status: 'Inactive',
    api_template: 'Yes',
    date_created: '30/04/2025 11:30 AM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 2',
    url: 'https://phonify.com/site/demo',
    method: 'DELETE',
    status: 'Active',
    api_template: 'No',
    date_created: '01/05/2025 04:05 PM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 1',
    url: 'https://phonify.com/site/demo',
    method: 'GET',
    status: 'Active',
    api_template: 'Yes',
    date_created: '02/05/2025 08:20 AM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 3',
    url: 'https://phonify.com/site/demo',
    method: 'POST',
    status: 'Inactive',
    api_template: 'No',
    date_created: '03/05/2025 06:55 PM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 2',
    url: 'https://phonify.com/site/demo',
    method: 'GET',
    status: 'Active',
    api_template: 'Yes',
    date_created: '04/05/2025 12:00 PM',
  },
  {
    api_name: 'API#',
    campaign_name: 'Campaign 1',
    url: 'https://phonify.com/site/demo',
    method: 'POST',
    status: 'Active',
    api_template: 'No',
    date_created: '05/05/2025 10:40 AM',
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
    <BaseHeader title="API">
      <template #actions>
        <div class="relative mt-4 md:mt-0">
          <Input placeholder="Search API" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button>
          <Icon class="!text-white" name="lucide:plus" />
          Add API
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ConfigurationAPITable :list="dummyLeads" :meta="meta" :loading="false" />
    </div>
  </div>
</template>
