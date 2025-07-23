<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { ref, onMounted, onUnmounted } from 'vue'

const isDisabled = ref(false)
const countdown = ref(10)
let timer: NodeJS.Timeout | null = null

const handleRefresh = () => {
  // Disable the button
  isDisabled.value = true
  countdown.value = 10
  
  // Start countdown
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      isDisabled.value = false
      if (timer) clearInterval(timer)
    }
  }, 1000)
  
  // Here you would also call your actual refresh logic
  // refreshData()
}

// Clean up timer when component unmounts
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div>
    <!-- HEADER -->
    <BaseHeader title="Live Call List">
      <template #actions>
        <!-- Trigger Button -->
        <Button @click="handleRefresh" :disabled="isDisabled">
          <Icon name="material-symbols:autorenew" class="text-xl text-white" />
          Refresh {{ isDisabled ? `(in ${countdown})` : '' }}
        </Button>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ReportLiveCallTable />
    </div>
  </div>
</template>