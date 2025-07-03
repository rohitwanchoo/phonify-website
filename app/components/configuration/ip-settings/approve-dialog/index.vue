<script setup lang="ts">
import approveImage from '~/assets/svg/approve.svg'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import Carousel from './Carousel.vue'

// Define props for the row data
interface IpData {
  whitelist_ip: string
  server_ip: string
  user: string
  ip_location: string | null

}

const props = defineProps<{
  rowData?: IpData[]
}>()

const open = defineModel<boolean>('open', { default: false })
const payload = computed(() => {
  if (props.rowData && props.rowData?.length > 1) {
    return props.rowData.map(item => ({ serverIp: item.server_ip, whitelistIp: item.whitelist_ip }))
  }
  else {
    return {
      serverIp: props.rowData?.[0]?.server_ip,
      whitelistIp: props.rowData?.[0]?.whitelist_ip,
    }
  }
})

const loading = ref(false)

function onSubmit() {
  loading.value = true
  useApi().post('/ip/approve', payload.value).then((response) => {
    showToast({
      message: response.message,
    })
    open.value = false
  }).catch((error) => {
    showToast({
      message: error.message,
      type: 'error',
    })
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="bg-[url('/images/dialog-background/approve-bg.jpg')] bg-cover bg-center max-w-[500px]">
      <img class="h-[98px] w-[98px] mx-auto mt-10" :src="approveImage" alt="approval Image">
      <div v-if="rowData && rowData.length > 1" class="max-w-[460px]">
        <Carousel :row-data="rowData" />
      </div>
      <div v-else>
        <div class="text-center mt-4">
          <p class="text-xl font-semibold text-primary">
            Approve This IP!
          </p>
          <p class="text-sm text-primary mb-5 mt-1">
            You are about to approve this IP, do you wish to proceed?
          </p>
          <div v-if="props.rowData" class="space-y-2 mb-4">
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
              <p class="text-sm text-muted-foreground">
                Ip Address
              </p>
              <p class="text-sm text-primary">
                {{ props.rowData[0]?.whitelist_ip }}
              </p>
            </div>
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
              <p class="text-sm text-muted-foreground">
                User
              </p>
              <p class="text-sm text-primary">
                {{ props.rowData[0]?.user }}
              </p>
            </div>
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
              <p class="text-sm text-muted-foreground">
                Location
              </p>
              <p class="text-sm text-primary">
                {{ props.rowData[0]?.ip_location || '-' }}
              </p>
            </div>
          </div>
          <div v-else class="text-sm text-muted-foreground py-4">
            No data available
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" class="w-[50%] h-10" @click="open = false">
          <Icon name="material-symbols:close" size="18" />
          Close
        </Button>
        <Button type="submit" class="w-[50%] h-10" @click="onSubmit">
          <Icon :name="loading ? 'eos-icons:loading' : `material-symbols:check`" size="18" />
          Approve
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
