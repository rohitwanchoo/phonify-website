<script setup lang="ts">
const open = ref(false)
const tempGroup = ref<any>({})

function renameGroup(group: any) {
  tempGroup.value = group
  open.value = true
}
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Extension Group">
      <template #actions>
        <UserManagementGroupAdd v-model:open="open" v-model:temp-group="tempGroup" @refresh="refreshNuxtData('extension-group-list')" />
      </template>
    </BaseHeader>

    <UserManagementGroupResizablePanels @on-rename="renameGroup" />
  </div>
</template>
