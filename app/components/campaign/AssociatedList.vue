<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { Button } from '~/components/ui/button'

interface Props {
  values: any
  loading: boolean
}

defineProps<Props>()
const emits = defineEmits(['setFieldValue', 'cancelEdit', 'submit', 'completed'])
const start = ref(0)
const limit = ref(10)
const search = ref('')

const route = useRoute()
const id = route.query.id
const { enableEditSection } = useCreateCampaign()

const enableSelect = ref(false)
const selectedRowIds = ref<number[]>([])

const api = ref('/campaign-list')

// get list that is assigned to campaign with campaign_id
const { data: campaignList, status: campaignListStatus, refresh } = await useLazyAsyncData('get-list-update-campaign-preview', () =>
  useApi().post(api.value, { campaign_id: id, start: start.value, limit: limit.value, title: search.value }), {
  transform: (res) => {
    return res
  },
})

// search function
const searchList = useDebounceFn(() => {
  start.value = 0
  refresh()
}, 1000, { maxWait: 5000 })

function onEditClick() {
  selectedRowIds.value = campaignList.value.data.map((val: { list_id: number }) => val.list_id)
  api.value = '/raw-list'
  enableSelect.value = true
  enableEditSection.value = 'associated-list'
  refresh()
}

function cancelEdit() {
  enableSelect.value = false
  selectedRowIds.value = []
  api.value = '/campaign-list'
  refresh()
  enableEditSection.value = ''
  emits('cancelEdit')
}

function changePage(page: number) {
  start.value = Number((page - 1) * limit.value)
  return refresh()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refresh()
}
const loading = ref(false)

function save() {
  // assign list to campaign
  loading.value = true
  useApi().post('/campaign/assign-lists', { campaign_id: id, lead_list_ids: selectedRowIds.value }).then((response) => {
    loading.value = false
    emits('completed')
    showToast({ message: response.message })
    cancelEdit()
  }).catch((error) => {
    showToast({ type: 'error', message: error.message })
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class=" px-5 pt-5  flex items-center justify-between">
      <div class="text-[16px] font-medium text-primary/100">
        Associated List
      </div>
      <div class="flex items-center gap-x-2">
        <div v-if="enableEditSection === 'associated-list'" class="flex gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="cancelEdit">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button :disabled="loading" class="w-[105px] rounded" size="sm" @click="save()">
            <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save-rounded'" />
            Save
          </Button>
        </div>
        <div v-else class="flex items-center gap-x-2">
          <Button :disabled="enableEditSection.length" type="button" variant="outline" size="sm" class="rounded" @click="onEditClick">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
      </div>
    </div>
    <div v-if="enableEditSection === 'associated-list'" class="px-3">
      <BaseInputSearch v-model="search" class="w-[300px]" placeholder="Search" @update:model-value="searchList" />
    </div>
    <CampaignSelectListTable
      v-model:selected-rows="selectedRowIds"
      classes="!border-none !rounded-none"
      :start="start"
      :limit="limit"
      :total-rows="campaignList?.total_rows" :enable-select="enableSelect"
      :list="campaignList?.data || []" :loading="campaignListStatus === 'pending'"
      @page-navigation="changePage" @change-limit="changeLimit"
    />
  </div>
</template>
