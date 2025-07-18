<!-- <script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const tempGroup = ref<any>({})

function renameGroup(group: any) {
  tempGroup.value = group
  open.value = true
}
</script>

<template>
  <div>
    <BaseHeader title="Chat SMS">
      <template #actions>
        <UserManagementGroupAdd
          v-model:open="open"
          v-model:temp-group="tempGroup"
          @refresh="refresh"
        />
      </template>
    </BaseHeader>

    <div>
      <SmsChatTable
        :loading="false"
        :extension-group="extensionGroup"
        @refresh="refresh"
        @on-rename="renameGroup"
      />
    </div>
  </div>
</template> -->
<template>
  <div>
    chat-sms page
  </div>
</template>
