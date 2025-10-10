<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'



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
        <!-- <Button>
          <Icon class="!text-white" name="lucide:plus" />
          Add Group
        </Button> -->
      </template>
    </BaseHeader>

    <div class="">
      <UserManagementGroupResizablePanels  @on-rename="renameGroup" />
    </div>
  </div>
</template>
