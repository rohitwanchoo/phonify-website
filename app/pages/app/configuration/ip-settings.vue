<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

const showWhitelistDialog = ref(false)
</script>

<template>
  <BaseHeader title="IP Approval List">
    <template #actions>
      <div class="relative">
        <Input placeholder="Search List" />
        <Icon class="absolute top-[9px] right-2" name="lucide:search" />
      </div>
      <ConfigurationIpSettingsFilterSheetButton />
      <Button @click="showWhitelistDialog = true">
        <Icon class="!text-white" name="material-symbols:language" />
        Whitelist IP
      </Button>
    </template>
  </BaseHeader>

  <!-- TABLE -->
  <div>
    <ConfigurationIpSettingsTable />
  </div>

  <!-- Whitelist IP Dialog -->
  <Dialog v-model:open="showWhitelistDialog">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Whitelist New IP</DialogTitle>
        <DialogDescription>
          Add a new IP address to the whitelist. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="ip-address" class="text-right">
            IP Address
          </label>
          <Input id="ip-address" placeholder="192.168.1.1" class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <label for="description" class="text-right">
            Description
          </label>
          <Input id="description" placeholder="e.g. Office Network" class="col-span-3" />
        </div>

        <div class="grid grid-cols-4 items-center gap-4">
          <label for="server" class="text-right">
            Server
          </label>
          <Select>
            <SelectTrigger class="col-span-3">
              <SelectValue placeholder="Select server" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us-east">
                US East
              </SelectItem>
              <SelectItem value="us-west">
                US West
              </SelectItem>
              <SelectItem value="eu">
                Europe
              </SelectItem>
              <SelectItem value="asia">
                Asia
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="showWhitelistDialog = false">
          Cancel
        </Button>
        <Button type="submit">
          Save IP
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
