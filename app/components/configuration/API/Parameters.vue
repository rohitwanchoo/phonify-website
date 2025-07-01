<script setup lang="ts">
import { ConfigurationAPIAddParameter, Icon } from '#components'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const rows = ref([
  { id: 1, apiName: '', apiType: '' },
  { id: 2, apiName: '', apiType: '' },
  { id: 3, apiName: '', apiType: '' },
  { id: 4, apiName: '', apiType: '' },
  { id: 5, apiName: '', apiType: '' },
])

const apiTypeOptions = [
  { label: 'Data parameter #', value: 'Type A' },
  { label: 'Data parameter 1', value: 'Type B' },
  { label: 'Data parameter #', value: 'Type C' },
]

const showAddDialog = ref(false)

function removeRow(idx: number) {
  rows.value.splice(idx, 1)
}

function openAddDialog() {
  showAddDialog.value = true
}

function closeAddDialog() {
  showAddDialog.value = false
}

function handleSaved() {
  showAddDialog.value = false
  // Optionally refresh or add to rows here
}
</script>

<template>
  <div class="border rounded-xl bg-white">
    <div class="flex items-center justify-between px-4 pt-4">
      <h2 class="text-lg font-normal">
        Parameters
      </h2>
      <Button
        class="bg-black text-white h-8 md:h-11 px-2 md:px-4 flex items-center gap-1"
        type="button"
        @click="openAddDialog"
      >
        <Icon class="!text-white" name="lucide:plus" />
        Add Parameter
      </Button>
    </div>
    <div class="my-2 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="bg-gray-50 text-center w-10 text-sm font-normal text-gray-500">
              #
            </TableHead>
            <TableHead class="bg-gray-50 py-4">
              <div class="inline-flex items-center justify-center gap-0.5 w-full text-sm font-normal text-gray-500">
                API Name
                <Icon name="lucide:chevrons-up-down" class="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead class="bg-gray-50">
              <div class="inline-flex items-center justify-center gap-0.5 w-full text-sm font-normal text-gray-500">
                API Name
                <Icon name="lucide:chevrons-up-down" class="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead class="bg-gray-50 text-center w-20 text-sm font-normal text-gray-500">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, idx) in rows" :key="row.id">
            <TableCell class="text-center">
              {{ idx + 1 }}
            </TableCell>
            <TableCell class="p-3">
              <Input
                v-model="row.apiName"
                class="h-9 py-5 w-50 md:w-full"
                placeholder="parameter #"
              />
            </TableCell>
            <TableCell>
              <Select v-model="row.apiType">
                <SelectTrigger class="h-9 w-50 md:w-full py-5">
                  <SelectValue placeholder="Data parameter #" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="opt in apiTypeOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell class="text-center">
              <Button
                size="icon"
                variant="outline"
                class="border-red-600 text-red-600 hover:text-red-600/80 flex items-center gap-1 px-2 py-5 w-21"
                @click="removeRow(idx)"
              >
                <Icon name="material-symbols:delete" />
                <span class="text-xs font-normal">Remove</span>
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <ConfigurationAPIAddParameter
      :open="showAddDialog"
      @close="closeAddDialog"
      @saved="handleSaved"
    />
  </div>
</template>
