<script setup lang="ts">
const { data: ringGroupList, status } = await useLazyAsyncData('ring-group-list', () =>
  useApi().post('ring-group', {

  }), {
  transform: (res) => {
    return res.data
  },
})

const search = ref('')
</script>

<template>
  <BaseHeader title="Ring Group List">
    <template #actions>
      <BaseInputSearch v-model="search" />
      <UserManagementRingGroupAdd />
    </template>
  </BaseHeader>
  <UserManagementRingGroupTable :list="ringGroupList" :loading="status === 'pending'" />
</template>
