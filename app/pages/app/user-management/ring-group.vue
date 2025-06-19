<script setup lang="ts">
const { data: ringGroupList, status, refresh } = await useLazyAsyncData('ring-group-list', () =>
  useApi().post('ring-group', {
    body: {
      start: 1,
      limit: 2,
    },
  }), {
  transform: (res) => {
    return res.data
  },
})
const open = ref(false)
const tempRingGroup = ref<any>()

function openEditModel(item: any) {
  tempRingGroup.value = item
  open.value = true
}

const search = ref('')
</script>

<template>
  <BaseHeader title="Ring Group List">
    <template #actions>
      <BaseInputSearch v-model="search" />
      <UserManagementRingGroupAdd v-model:open="open" :temp-ring-group="tempRingGroup" @complete="refresh()" />
    </template>
  </BaseHeader>
  <UserManagementRingGroupTable :list="ringGroupList" :loading="status === 'pending'" @edit="openEditModel" />
</template>
