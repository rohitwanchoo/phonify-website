<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

// 🧱 Static placeholder data instead of API
const extensionGroup = ref([
  { id: 1, name: 'Sales Team' },
  { id: 2, name: 'Support Team' },
  { id: 3, name: 'Marketing Team' },
])

const open = ref(false)
const tempGroup = ref<any>({})

// 📝 Rename handler
function renameGroup(group: any) {
  tempGroup.value = group
  open.value = true
}

// 🔁 Refresh placeholder (no real API, just a dummy method)
function refresh() {
  console.log('Refreshing extension groups...')
}
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Chat SMS">
      <template #actions>
        <UserManagementGroupAdd
          v-model:open="open"
          v-model:temp-group="tempGroup"
          @refresh="refresh"
        />
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <SmsChatTable
        :loading="false"
        :extension-group="extensionGroup"
        @refresh="refresh"
        @on-rename="renameGroup"
      />
    </div>
  </div>
</template>
