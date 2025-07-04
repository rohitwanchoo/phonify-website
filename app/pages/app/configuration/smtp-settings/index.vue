<script setup lang="ts">
import moment from 'moment'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ConfigurationSmtpSettingsTable from '@/components/configuration/smtp-settings/table/index.vue'
import TableServerPagination from '@/components/table/ServerPagination.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Dummy SMTP data
const dummySmtpList = [
  {
    type: 'system',
    sender: 'airtel',
    mail_driver: 'SMTP',
    host: 'smtp1@email.com',
    port: '587',
    username: 'alice',
    encryption: 'TLS',
    status: true,
  },
  {
    type: 'campaign',
    sender: 'VAPI test',
    mail_driver: 'SMTP',
    host: 'smtp2@email.com',
    port: '465',
    username: 'bob',
    encryption: 'SSL',
    status: false,
  },
  {
    type: 'users',
    sender: 'Root admin',
    mail_driver: 'SMTP',
    host: 'smtp3@email.com',
    port: '252',
    username: 'charlie',
    encryption: 'TLS',
    status: true,
  },
  {
    type: 'system',
    sender: 'predictive test',
    mail_driver: 'SMTP',
    host: 'smtp4@email.com',
    port: '123',
    username: 'diana',
    encryption: 'SSL',
    status: false,
  },
]

const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: dummySmtpList.length,
}

const searchQuery = ref('')
const currentPage = ref(1)
const perPage = ref(10)

const router = useRouter()

// Filter SMTP list
const filteredList = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return dummySmtpList.filter(item =>
    item.type?.toLowerCase().includes(query)
    || item.sender?.toLowerCase().includes(query)
    || item.mail_driver?.toLowerCase().includes(query)
    || item.host?.toLowerCase().includes(query)
    || item.port?.toLowerCase().includes(query)
    || item.username?.toLowerCase().includes(query)
    || item.encryption?.toLowerCase().includes(query),
  )
})

const totalRows = computed(() => filteredList.value.length)
const lastPage = computed(() => Math.ceil(totalRows.value / perPage.value))

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredList.value.slice(start, end)
})

function handlePageChange(page: number) {
  currentPage.value = page
}

function handleChangeLimit(val: number) {
  perPage.value = val
  currentPage.value = 1
}

watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div>
    <!-- Header -->
    <BaseHeader title="SMTP">
      <template #actions>
        <div class="relative mt-4 md:mt-0">
          <Input v-model="searchQuery" placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button @click="router.push('/app/configuration/smtp-settings/add-smtp?mode=add')">
          <Icon class="!text-white" name="lucide:plus" />
          Add SMTP
        </Button>
      </template>
    </BaseHeader>

    <!-- Table -->
    <ConfigurationSmtpSettingsTable
      :list="paginatedList"
      :loading="false"
    />

    <!-- Pagination -->
    <div v-if="totalRows" class="flex items-center justify-end space-x-2 py-4 flex-wrap">
      <div class="flex-1 text-xs text-primary">
        <div class="flex items-center gap-x-2 justify-center sm:justify-start">
          Showing {{ currentPage }} to
          <span>
            <select v-model="perPage" class="border rounded px-2 py-1 text-xs" @change="handleChangeLimit(Number($event.target.value))">
              <option v-for="n in [10, 15, 20, 50]" :key="n" :value="n">{{ n }}</option>
            </select>
          </span>
          of {{ totalRows }} entries
        </div>
      </div>
      <div class="space-x-2">
        <TableServerPagination
          :total-items="Number(totalRows)"
          :current-page="Number(currentPage)"
          :items-per-page="Number(perPage)"
          :last-page="Number(lastPage)"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>
