<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const start = ref(0)
const limit = ref(10)
const search = ref('')

const aiList = [
  {
    id: 1,
    title: "Direct Brand Engineer",
    voice: "Noel Pfeffer",
    description:
      "Lorem ipsum dolor sit amet consectetur. Donec cursus volutpat aliquet ut amet non."
  },
  {
    id: 2,
    title: "Future Metrics Producer",
    voice: "Meredith Sauer",
    description:
      "Ultricies enim massa tincidunt eget egestas. Integer id fermentum risus."
  },
  {
    id: 3,
    title: "Principal Program Assistant",
    voice: "Boyd Torp",
    description:
      "Morbi ornare quam in egestas et. Mauris eget fermentum nibh."
  },
  {
    id: 4,
    title: "Direct Markets Planner",
    voice: "Wanda Ryan",
    description:
      "Semper id consectetur nisl donec. Nam et id malesuada ultricies."
  },
  {
    id: 5,
    title: "Implementation Specialist",
    voice: "Gary Lacefield",
    description:
      "Mauris et ante vitae libero blandit hendrerit. Scelerisque sit amet."
  },
  {
    id: 6,
    title: "ICDR Bank Payment Recorder",
    voice: "Ellen Conely",
    description:
      "Etiam tempor ac aliquet urna molestie facilisis. Dolor viverra."
  },
  {
    id: 7,
    title: "Global Infrastructure Specialist",
    voice: "Irweld Sauer",
    description:
      "Integer vulputate sapien at mi cursus accumsan. Suspendisse vel."
  },
  {
    id: 8,
    title: "District Marketing Demo",
    voice: "Freddy Ogrydziak",
    description:
      "Dictum non magna ipsum. Dignissim in arcu lacus fermentum arcu."
  },
  {
    id: 9,
    title: "Interactions Facilitator",
    voice: "Dennis Rouder",
    description:
      "Morbi volutpat auctor non tellus. Nunc tincidunt nisl et dictum."
  },
  {
    id: 10,
    title: "National Division Assistant",
    voice: "Ruth Bemar",
    description:
      "In fermentum sit amet quam quisque auctor nec. Donec suscipit dignissim."
  },
]


const aiListStatus = ref('success')

function refreshAiList () {
    aiListStatus.value = 'pending'
    setTimeout(() => {
        aiListStatus.value = 'success'
    }, 2000);
}

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refreshAiList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshAiList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshAiList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div>
    <BaseHeader title="Manage Prompts">
      <template #actions>
        <BaseInputSearch v-model="search" placeholder="Search Prompts" class="w-[300px]" @update:model-value="searchText" />
        <NuxtLink to="/app/configuration/ai-prompts/add">
          <Button class="h-11 bg-red-600 hover:bg-red-500">
            <Icon class="!text-white text-xl" name="material-symbols:add" />
            Add Prompts
          </Button>
        </NuxtLink>
      </template>
    </BaseHeader>
    <!-- Table -->
    <ConfigurationAiPromptsTable
      :loading="aiListStatus === 'pending'"
      :list="aiList || []"
      :limit="limit"
      :total-rows="aiList.length"
      :start="start"
      @page-navigation="changePage"
      @change-limit="changeLimit"
      @refresh="refreshAiList"
    />
  </div>
</template>
