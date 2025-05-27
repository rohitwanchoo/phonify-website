<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
</script>

<template>
  <div class="">
    <!-- HEADER -->
    <BaseHeader title="Extension List">
      <template #actions>
        <div class="relative">
          <Input placeholder="Search List" />
          <Icon class="absolute top-[9px] right-2" name="lucide:search" />
        </div>
        <Button variant="outline" class="text-black bg-white">
          <Icon class="!text-black" name="lucide:download" />
          Excel
        </Button>
        <Nuxt-link to="/app/extension/new-extension">
          <Button>
            <Icon class="!text-white" name="lucide:plus" />
            Add Extensions
          </Button>
        </Nuxt-link>
      </template>
    </BaseHeader>

    <!-- TABLE -->
    <div>
      <ExtensionTable />
    </div>
  </div>
</template>
