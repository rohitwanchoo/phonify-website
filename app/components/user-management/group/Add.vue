<script setup lang="ts">
import { object } from 'zod'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

const emits = defineEmits(['refresh'])

interface Group {
  id?: number
  title: string

}

const title = ref('')
const loading = ref(false)
const open = defineModel<boolean>('open')
const tempGroup = defineModel<Group | null>('tempGroup', { default: null })

function addNewGroup() {
  loading.value = true
  useApi().put('/extension-group', {
    title: title.value,
  }).then((res) => {
    showToast({ message: res.message })
    open.value = false
    emits('refresh')
    title.value = ''
  }).catch((err) => {
    showToast({ message: err.message, type: 'error' })
  }).finally(() => {
    loading.value = false
  })
}

function updateGroup() {
  loading.value = true
  useApi().patch(`/extension-group/${tempGroup.value?.id}`, {
    title: title.value,
  }).then((res) => {
    showToast({ message: res.message })
    open.value = false
    emits('refresh')
    title.value = ''
  }).catch((err) => {
    showToast({ message: err.message, type: 'error' })
  }).finally(() => {
    loading.value = false
  })
}
const isRename = computed(() => {
  return Object.keys(tempGroup.value || {}).length > 0
})

function save() {
  if (isRename.value) {
    updateGroup()
  }
  else {
    addNewGroup()
  }
}

function setRenameValues() {
  if (tempGroup.value) {
    title.value = tempGroup.value.title
  }
}

watch(() => open.value, (val) => {
  if (val) {
    setRenameValues()
  }
  else {
    title.value = ''
    tempGroup.value = null
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button>
          <Icon class="!text-white" name="lucide:plus" />
          Add Group
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex items-center justify-between">
          {{ isRename ? 'Rename Extension Group' : 'Add Extension Group' }}
          <DialogClose class="cursor-pointer">
            <Icon name="mdi:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>
      <div class="">
        <div class="space-y-2">
          <Label for="name" class="text-right text-sm">
            Name
          </Label>
          <Input id="name" v-model="title" class="h-11" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose class="w-1/2">
          <Button variant="outline" class="border-red-600 w-full h-11">
            <Icon name="mdi:close" />
            Close
          </Button>
        </DialogClose>

        <Button variant="default" :disabled="!title || loading" class="w-1/2 h-11" @click="save">
          <Icon :name="loading ? 'line-md:loading-twotone-loop' : 'material-symbols:save-outline'" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
