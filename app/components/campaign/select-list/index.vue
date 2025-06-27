<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import ListTable from './table.vue'

const emit = defineEmits(['completed'])
const route = useRoute()
const campaign_id = route.query.id
const isEdit = computed(() => !!campaign_id)

const selectedRows =ref<number[]>([])

const dialogRef = ref()

function openDialog() {
  dialogRef.value?.open()
}

function handleContinue() {
  emit('completed')
}
const { data: campaignList, status: campaignListStatus, refresh:refreshCampaignList } = await useLazyAsyncData('get-list-update-campaign', () =>
  useApi().post('/campaign-list', { campaign_id }), {
  transform: (res) => {
    return res.data
  },
  immediate: false
})
const { data: list, status: listStatus, refresh: listRefresh } = await useLazyAsyncData('get-list-create-campaign', () =>
  useApi().post('/list', { campaign_id }), {
  transform: (res) => {
    return res.data
  },
})
const tableList = computed(() => isEdit.value ? campaignList : list)
const loading = computed(() => campaignListStatus.value === 'pending' || listStatus.value === 'pending')

function setSelectedRow(){
  if(isEdit.value){
    refreshCampaignList().then(()=> {
      selectedRows.value = campaignList.value.map((val) => val.list_id)
    })
  }
   
}
onMounted(()=>{
  setSelectedRow()
})  
</script>

<template>
  <div class="px-4 py-6 h-[calc(100vh-255px)]">
    <div class="flex w-full flex-col sm:flex-row sm:justify-between items-center">
      <h2 class="text-xl text-primary">
        Lists
      </h2>
      <div class="flex items-center justify-between gap-5">
        <label for="Email" class="relative">
          <input
            id="Email"
            type="email"
            class="mt-0.5 w-[250px] rounded-md bg-white border-gray-300 px-3 h-10 shadow-sm sm:text-sm pr-10"
            placeholder="Search List"
          >
          <Icon name="lucide:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
        </label>
        <Button class="h-10 cursor-pointer" @click="openDialog">
          + Create List
        </Button>
      </div>
    </div>
    <!-- data -->
    <ListTable :list="list || []" :is-edit="isEdit" v-model:selected-rows="selectedRows" :loading="loading" :meta="meta" />
  </div>

  <div class="sticky bg-white bottom-0 right-0 w-full shadow-2xl p-4">
    <Button class="w-full h-[52px] cursor-pointer" type="submit" @click="handleContinue">
      Continue
      <Icon name="lucide:arrow-right" size="20" />
    </Button>
  </div>

  <!-- Dialog component -->
  <CampaignSelectListDialog ref="dialogRef" />
</template>
