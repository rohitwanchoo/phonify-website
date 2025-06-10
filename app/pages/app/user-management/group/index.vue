<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const { data: extensionGroup, status, refresh } = await useLazyAsyncData('extension-group-list', () =>
  useApi().get('extension-group'), {
  transform: (res) => {
    return res.data
  },
})

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
        <UserManagementGroupAdd v-model:open="open" @refresh="refresh" v-model:temp-group="tempGroup"/>
        <!-- <Button>
          <Icon class="!text-white" name="lucide:plus" />
          Add Group
        </Button> -->
      </template>
    </BaseHeader>

    <div class="">
      <UserManagementGroupResizablePanels :loading="status === 'pending'" :extension-group="extensionGroup" @refresh="refresh" @on-rename="renameGroup" />
    </div>
  </div>
</template>
