<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '~/components/ui/button/Button.vue'

defineProps<Props>()

const router = useRouter()
const route = useRoute()

interface Field {
  id: number
  title: string
  value: string
  is_dialing: number
  column_name?: string // optional since not all fields have it
}

interface Props {
  data?: Field[]
  loading: boolean
}
function onEdit() {
  router.push(`/app/lead-management/lead/${route.params.id}/edit?list_id=${route.query.list_id}`)
}
</script>

<template>
  <div class="rounded-lg border border-gray-200  shadow-sm bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-200 pb-4 p-4">
      <h2 class="text-lg lg:text-base xl:text-lg font-semibold text-gray-800">
        Lead Details
      </h2>
      <Button class="bg-white text-black border border-black h-11 p-3 hover:bg-white" @click="onEdit">
        <Icon name="material-symbols:edit-square" size="20" />
        Edit
      </Button>
    </div>

    <!-- Details List -->
    <div class="space-y-2 p-4 h-full lg:max-h-[calc(100vh-260px)] overflow-y-auto">
      <template v-if="loading">
        <BaseSkelton v-for="i in 9" :key="i" class="h-10 w-full mb-2" rounded="rounded-sm" />
      </template>
      <template v-else>
        <template v-for="item in data" :key="item.id">
          <div class="flex justify-between border border-[#00A0861A] p-3 rounded-lg text-sm bg-[#00A08605]">
            <span class="text-[#162D3AB2]">{{ item.title }}</span><span>{{ item.value || '-' }}</span>
          </div>
        </template>
      </template>

      <div class="flex justify-between text-sm">
        <span class="text-[#162D3AB2]" />
      </div>
    </div>
  </div>
</template>
