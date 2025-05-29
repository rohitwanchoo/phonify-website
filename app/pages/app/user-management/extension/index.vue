<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const data = [
  {
    extension: 123456,
    secret: '********',
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: 1234567890,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
  {
    extension: 123456,
    secret: '********',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: 9876543210,
  },
]
const meta = {
  current_page: 1,
  per_page: 10,
  last_page: 1,
  total: 20,
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Extension List">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button variant="outline" class="text-black bg-white">
          <Icon class="!text-black" name="lucide:download" />
          Excel
        </Button>
        <Nuxt-link to="/app/user-management/extension/create">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Add Extensions
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <UserManagementExtensionTable :list="data" :meta="meta" />
    </div>
  </div>
</template>
